const Course = require("./../model/course.model");
const User = require("./../model/user.model");
const WatchList = require("./../model/watchlist.model");
const Feedback = require('./../model/feedback.model')
const catchAsync = require("./../utils/catchAsync");
const registeredCourse = require("./../model/registedCourse.model");
const pagination = require("./../utils/pagination");
const categories = require('./../utils/categories');
const Lecture = require("../model/lecture.model");
const fs = require('fs');

async function getTopSubcategory(date, weekAgo) {
  const registeredcourses = await registeredCourse.find().lean();
  let subcategories = []
  for (let index = 0; index < registeredcourses.length; index++) {
    registeredcourses[index].courses.forEach(element => {
      if (element.registeredAt > weekAgo && element.registeredAt < date) {
        subcategories.push(element);
      }
    });

  }
  subcategories.sort((a, b) => a.numStudents - b.numStudents)

  for (let i = 0; i < subcategories.length; i++) {
    subcategories[i] = subcategories[i].course.subcategory;
  }


  return new Set(subcategories);

}

exports.getOverview = catchAsync(async (req, res, next) => {
  try {
    let date = new Date();
    let weekAgo = new Date().setDate(date.getDate() - 7)

    // Top 10 khoá học được xem nhiều nhất
    const topViewedCourses = await Course.find({active: {$ne: false}}, { _id: 0, __v: 0 })
      .sort({ views: -1 })
      .limit(10)
      .lean({ virtuals: true });

    // Top 10 khoá học mới nhất
    const topNewestCourses = await Course.find({active: {$ne: false}}, { _id: 0, __v: 0 })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean({ virtuals: true });

    // Top 5 khoá học nổi bật nhất trong tuần qua
    const topTrending = await Course.find({ createdAt: { $gt: weekAgo, $lt: date },active: {$ne: false} }, { _id: 0, __v: 0 })
      .sort({ ratingsAverage: 1, createdAt: -1 })
      .limit(5)
      .lean({ virtuals: true });

    //top lĩnh vực được đăng ký học nhiều nhất trong tuần qua
    let subcategories = [...(await getTopSubcategory(date, weekAgo))].slice(0, 5);

    const topPurchasedCourses = await Course.find({ numStudents: { $gt: 0 }, active: {$ne: false} }, { _id: 0, __v: 0 })
      .sort({ numStudents: -1 })
      .limit(5)
      .lean({ virtuals: true });

    let categories = Course.schema.path("category").enumValues; // Get all enum values of category
    let user = res.locals.user;
    if (user) user = { name: user.name, email: user.email, role: user.role };
    res.status(200).render("home", {
      title: "Home",
      user: user,
      topTrending: topTrending,
      topViewedCourses: topViewedCourses,
      topNewestCourses: topNewestCourses,
      topPurchasedCourses: topPurchasedCourses,
      topCategories: subcategories,
      categories: categories,
    });
  } catch (error) {
    console.log(error);
  }

});



const getStatFeedback = (feedbacks) => {
  // Thống kê feedback của một course

  const numFeebacks = feedbacks.length;

  // Thống kê số lượng các lượt đánh giá
  const stars = [0, 0, 0, 0, 0];

  for (let i = 0; i < numFeebacks; i++) {
    stars[feedbacks[i].rating - 1] += 1;
  }
  if (numFeebacks > 0)
    for (let i = 0; i < 5; i++) {
      stars[i] = Math.round((stars[i] / numFeebacks) * 100);
    }
  return stars;
}

exports.getCourse = catchAsync(async (req, res, next) => {
  try {
    const slugName = req.params.slug;
    const course = await Course.findOneAndUpdate({ slug: slugName }, { $inc: { views: 1 } }).populate('contents.lectures').lean({ virtuals: true });

    let isPurchase = false;
    let isWatched = false;

    if (!course) {
      res.redirect("back");
      return;
    }

    let user = res.locals.user;
    if (user) {
      if (user.role === 'customer') {
        const registeredcouse = await registeredCourse.findOne({ userID: user.id, "courses.course": course.id });
        if (registeredcouse)
          isPurchase = true;
        const watchlist = await WatchList.findOne({ userID: user.id, courses: course.id }).lean();

        if (watchlist)
          isWatched = true;
      }
      user = { name: user.name, email: user.email, role: user.role };
    }

    course.views++;


    const feedbacks = await Feedback.find({ courseID: course.id })
      .populate('userID')
      .lean();
    const feedbackStat = getStatFeedback(feedbacks);

    const numFeedbacks = feedbacks.length || 0;


    const topTrending = await Course.find({ slug: { $ne: slugName }, category: course.category }, { _id: 0, __v: 0 })
      .sort({ ratingsAverage: 1, createdAt: -1 })
      .limit(5)
      .lean({ virtuals: true });

    res.status(200).render("course_detail_view", {
      title: course.name,
      course: course,

      user: user,
      isPurchase: isPurchase,
      isWatched: isWatched,
      topTrending: topTrending,
      //feedback
      feedbackable: isPurchase,
      feedbacks: feedbacks,
      feedbackStat,
      numFeedbacks,
      contents: course.contents
    });
  } catch (error) {
    console.log(error);
  }
});

exports.editCourse = catchAsync(async (req, res, next) => {
  try {
    const slugName = req.params.slug;
    const course = await Course.findOne({ slug: slugName }).lean({ virtuals: true });

    if (!course) {
      res.redirect("back");
      return;
    }

    let user = res.locals.user;

    if (user) user = { name: user.name, email: user.email, role: user.role };


    res.status(200).render("edit_course", {
      title: course.name,
      action: "Edit ",
      course: course,
      user: user,
    });
  } catch (error) {
    console.log(error);
  }
});

exports.editLecture = catchAsync(async (req, res, next) => {
  try {
    const slugName = req.params.slug;
    const content = req.params.content;
    const lectureSlug = req.params.lecture;

    const course = await Course.findOne({ slug: slugName }).lean({ virtuals: true });
    const lecture = await Lecture.findOne({ slug: lectureSlug }).lean();
    // Các contents trong course trừ content của lecture đang edit
    let contents = course.contents.map(value => value.name).filter(value => value !== content);

    let user = res.locals.user;

    if (user) user = { name: user.name, email: user.email, role: user.role };


    res.render("edit_lecture", {
      title: course.name,
      // course: course,
      courseSlug: slugName,
      currentContent: content,
      contents,
      user: user,
      lecture
    });
  } catch (error) {
    console.log(error);
  }
});

exports.getSessionCart = (req, res, next) => {
  if (req.session.cart) {
    res.locals.cart = req.session.cart;
  }
  next();
};

exports.getTeacherProfile = catchAsync(async (req, res, next) => {
  try {

    const userID = req.user.id;

    const user = await User.findById(userID).lean();

    const courses = await Course.find({ teacherID: userID }).lean({
      virtuals: true,
    });
    let numStudents = 0;
    courses.forEach((course) => {
      numStudents += course.numStudents

    })
    let categories = Course.schema.path("category").enumValues;
    res.status(200).render("profile", {
      title: "Profile",
      user: user,
      courses: courses,
      numCourse: courses.length,
      numStudents,
      categories
    });
  } catch (error) {
    console.log(error);
  }
});

exports.getInstructorView = catchAsync(async (req, res, next) => {
  try {

    const id = req.param('id');
    console.log(id);
    const user = await User.findById(id).lean();

    const courses = await Course.find({ teacherID: user._id }).lean({
      virtuals: true,
    });
    let numStudents = 0;
    courses.forEach((course) => {
      numStudents += course.numStudents
    })
    let categories = Course.schema.path("category").enumValues;

    res.status(200).render("profile", {
      title: "Profile",
      user: user,
      courses: courses,
      numCourse: courses.length,
      numStudents,
      categories
    });
  } catch (error) {
    console.log(error);
  }
});

exports.getStudentProfile = catchAsync(async (req, res, next) => {
  const userID = req.user.id;
  const user = await User.findById(userID).lean();
  const course = await registeredCourse
    .findOne({ userID: userID })
    .lean({ virtuals: true });
  let categories = Course.schema.path("category").enumValues; // Get all enum values of category

  if (course != null)
    res.status(200).render("student_profile", {
      title: "Profile",
      user: user,
      courses: course.courses,
      numCourses: course.courses.length,
      categories: categories,
    });
  else
    res.status(200).render("student_profile", {
      title: "Profile",
      user: user,
      course: null,
      numCourses: 0,
      categories: categories,
    });
});

exports.getStudentWatchedList = catchAsync(async (req, res, next) => {
  try {
    let user = res.locals.user;
    const watchlist = await WatchList
      .findOne({ userID: user.id })
      .lean({ virtuals: true });
    if (user) user = { name: user.name, email: user.email, role: user.role };
    if (watchlist)
      res.status(200).render("favourite_courses", {
        title: "My Wish List",
        user: user,
        watchlist: watchlist.courses,
        numCourses: watchlist.courses.length,
      });
    else {
      res.status(200).render("favourite_courses", {
        title: "My Wish List",
        user: user,

        numCourses: 0,
      });
    }
  } catch (error) {
    console.log(error);
  }

});

exports.editProfile = catchAsync(async (req, res, next) => {
  let user = req.user;

  if (user) user = { name: user.name, email: user.email, role: user.role };
  res.status(200).render("setting", {
    title: "Edit My Profile",
    user: user,
  });
});

exports.getCart = catchAsync(async (req, res, next) => {
  try {
    const cart = req.session.cart;
    let user = res.locals.user;

    if (user) user = { name: user.name, email: user.email, role: user.role };
    let totalPrice = 0;
    let isEmpty = true;
    let numCourse = 0;
    let courses = [];
    if (cart) {
      for (let i = 0; i < cart.length; i++) {
        courses.push(await Course.findOne({ slug: cart[i] }).lean());
      }

      courses.forEach((element) => {
        totalPrice += element.price;
      });
      numCourse = courses.length;
      if (numCourse != 0) isEmpty = false;
    }

    res.status(200).render("cart", {
      title: "Cart",
      user: user,
      empty: isEmpty,
      courseInCart: courses,
      numCourse: numCourse,
      totalPrice: totalPrice,
    });
  } catch (error) {
    console.log(error);
  }
});


exports.createNewCourse = async (req, res) => {


  let user = res.locals.user;

  if (user) user = { name: user.name, email: user.email, role: user.role };
  res.render('create_new_course', {
    title: "Create New Course",
    user: user,
    subcategories: categories.subcategories
  })

}
exports.createNewLecture = async (req, res) => {

  const slugName = req.params.slug;
  let user = res.locals.user;

  if (user) user = { name: user.name, email: user.email, role: user.role };
  res.render('create_new_lecture', {
    title: "Create New Lecture",
    user: user,
    slug: slugName

  })

}

exports.isCompleted = async (req, res) => {
  const slugName = req.params.slug;
  console.log(slugName);
  const filter = { slug: slugName };
  const update = { isCompleted: true };

  let doc = await Course.findOneAndUpdate(filter, update, {
    new: true
  });
  res.redirect("back");


}
// access to admin page
exports.getAdmin = catchAsync(async (req, res, next) => {
  const listCourses = await Course.findAll({});
  //const listTeacherAccounts;
  //const listStudentAccounts;

  try {
    let user = res.locals.user;
    res.status(200).render("admin", {
      title: "Admin",
      //user: user,
    });
  } catch (error) {
    console.log(error);
  }
});

exports.blockOrUnblockUser = catchAsync(async (req, res, next) => {
  try {

    const id = req.query.id;
    let getUser = await User.findById(id);

    //if active is true => block it, else unblock it.
    if (getUser.active) {
      getUser.active = false;

    }
    else {
      getUser.active = true;

    }
    await getUser.save();
    res.redirect('/admin');
  } catch (error) {
    console.log(error);
  }
});

exports.blockOrUnblockCourse = catchAsync(async (req, res, next) => {
  try {

    const id = req.query.id;
    let getCourse = await Course.findById(id);

    //if active is true => block it, else unblock it.
    if (getCourse.active) {

      getCourse.active = false;

    }
    else {
      getCourse.active = true;

    }
    await getCourse.save();
    res.redirect('/admin');
  } catch (error) {
    console.log(error);
  }
});

exports.deleteSubCategory = catchAsync(async (req, res, next) => {
  try {
    const name = req.query.name;
    let subcategory = require('./../utils/categories').subcategories;

    for (let i = 0; i < subcategory.length; i++) {
      if (subcategory[i] == name) {
        subcategory = subcategory.splice(i, 1);
        break;
      }
    }

    const writeContent = "exports.subcategories = " + JSON.stringify(subcategory);
    fs.writeFile("./../tekcourse-website/utils/categories.js", writeContent, function (err) {
      if (err) {
        return console.log(err);
      }
  
    });

    res.redirect('/admin');
  } catch (error) {
    console.log(error);
  }
});

exports.editSubCategory = catchAsync(async (req, res, next) => {
  try {
    const newSubName = req.body.nameSubcate;
    const oldSubName = req.query.name;
    let subcategory = require('./../utils/categories').subcategories;

    if (subcategory.findIndex(element => element == newSubName) >= 0) {
      res.send(`
        <script>
          alert("The new name of sub category is duplicated");
          window.location = "/admin";
        </script>
      `);
    }
    else {
      const i = subcategory.findIndex(element => element == oldSubName);
      subcategory[i] = newSubName;

      const writeContent = "exports.subcategories = " + JSON.stringify(subcategory);
      fs.writeFile("./../tekcourse-website/utils/categories.js", writeContent, function (err) {
        if (err) {
          return console.log(err);
        }
        console.log("The file was saved!");
      });
    }

    res.redirect('/admin');
  } catch (error) {
    console.log(error);
  }
});

exports.createSubCategory = catchAsync(async (req, res, next) => {
  try {
    const newSubName = req.body.nameSubcate;
    let subcategory = require('./../utils/categories').subcategories;

    if (subcategory.findIndex(element => element == newSubName) >= 0) {
      res.send(`
        <script>
          alert("The new name of sub category is duplicated");
          window.location = "/admin";
        </script>
      `);
    }
    else {
      subcategory.push(newSubName);
      const writeContent = "exports.subcategories = " + JSON.stringify(subcategory);
      fs.writeFile("./../tekcourse-website/utils/categories.js", writeContent, function (err) {
        if (err) {
          return console.log(err);
        }
        console.log("The file was saved!");
      });
      res.send(`
        <script>
          alert("Create new sub category successfully");
          window.location = "/admin";
        </script>
      `);
    }

    res.redirect('/admin');
  } catch (error) {
    console.log(error);
  }
});