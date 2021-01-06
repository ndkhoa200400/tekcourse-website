const Course = require("./../model/course.model");
const catchAsync = require("./../utils/catchAsync");
const User = require("./../model/user.model")
const moment = require("moment");
const axios = require("axios");
const registeredCourse = require('./../model/registedCourse.model');
const pagination = require('./../utils/pagination');

exports.getOverview = catchAsync(async (req, res, next) => {

  const topViewedCourses = await Course.find({}, { _id: 0, __v: 0, }).sort({ "views": -1 }).limit(10).lean({ virtuals: true });

  const topNewestCourses = await Course.find({}, { _id: 0, __v: 0, }).sort({ "createdAt": -1 }).limit(10).lean({ virtuals: true });

  const topTrending = await Course.find({}, { _id: 0, __v: 0, }).sort({ "ratingsAverage": 1, 'createdAt': -1 }).limit(5).lean({ virtuals: true });

  //top lĩnh vực được đăng ký học nhiều nhất trong tuần qua
  //const topSubCate = await Course.find({},{_id: 0, __v: 0, }).select('subcategory -_id').lean({ virtuals: true });
  const subcategories = await Course.find({}).distinct("subcategory").populate("subcategory").lean({ virtuals: true });

  let date = new Date(Date.now);
  //date
  const topPurchasedCourses = await Course.find({}, { _id: 0, __v: 0, }).sort({ "numStudents": -1 }).limit(5).lean({ virtuals: true });

  let categories = Course.schema.path('category').enumValues; // Get all enum values of category
  //categories = categories.map(category => category[0].toUpperCase() + category.slice(1)); // Uppercase first letter
  
  let user = res.locals.user;
  if (user) user = { name: user.name, email: user.email, role: user.role };
  res.status(200).render("home", {
    title: "Home",
    user: user,
    topTrending: topTrending,
    topViewedCourses: topViewedCourses,
    topNewestCourses: topNewestCourses,
    topPurchasedCourses: topPurchasedCourses,
    topCategories : subcategories,
    categories: categories
  });
});

exports.getCourse = catchAsync(async (req, res, next) => {
  const slugName = req.params.slug;
  const course = await Course.findOneAndUpdate({ slug: slugName }, { $inc: { views: 1 } }).lean({ virtuals: true });
  let isPurchase = false;
  if (!course) {
    res.redirect("/");
    return;
  }

  let user = res.locals.user;

  if (user) user = { name: user.name, email: user.email, role: user.role };

  if (user.role === 'customer') {
    const registeredcouse = await registeredCourse.findOne({ userID: res.locals.user.id });
    if (registeredcouse)
      registeredcouse.courses.forEach(element => {
        if (element.id === course.id) {
          isPurchase = true;
          return;
        }
      });
  }
  course.views++;
  res.status(200).render("course_detail_view", {
    title: course.name,
    course: course,
    user: user,
    isPurchase: isPurchase
  });

});



exports.getSessionCart = (req, res, next)=>{
  if (req.session.cart)
  {
    res.locals.cart = req.session.cart;
  }
  next();
}

exports.getFilteredCourses = catchAsync(async (req, res, next) => {
  // let page = req.query.page || 1;
  // if (page < 1) page = 1;
  // const total = response.data.data.docs.length;

  // const page_numbers = pagination.calcPageNumbers(total, page);
  // const offset = pagination.calcOffset(page);
  // const next_page = pagination.calcNextPage(page, page_numbers);
  // const prev_page = pagination.calcPreviousPage(page, page_numbers);

  const queryString = req.url.substring(req.url.indexOf("?"));
  let user = res.locals.user;
  if (user) user = { name: user.name, email: user.email, role: user.role };

  const response = await axios({
    method: "GET",
    url: "http://localhost:8000/api/course" + queryString
  });

  if (response.data.status === "success") {
    res.status(200).render("search_result", {
      title: "Results",
      course: response.data.data.docs,
      // page_numbers,
      // next_page,
      // prev_page,
      user: user,

    });
  } else {
    res.render("error");
  }
})

exports.ProByCat = catchAsync(async (req, res, next) => {
  let page = req.query.page || 1;
  if (page < 1) page = 1;

  const catName = req.param('catName');
  const total = await Course.count({ category: catName })
    .lean({ virtuals: true });
  // var total = totalCourse.length;

  const page_numbers = pagination.calcPageNumbers(total, page);
  const offset = pagination.calcOffset(page);
  const next_page = pagination.calcNextPage(page, page_numbers);
  const prev_page = pagination.calcPreviousPage(page, page_numbers);
  let user = res.locals.user;

  const course = await Course.find({ category: catName }).limit(pagination.limit).skip(offset)
    .lean({ virtuals: true });

  if (user) user = { name: user.name, email: user.email, role: user.role };

  res.status(200).render("search_result", {
    title: catName,
    course: course,
    user: user,
    empty: course === null,
    categories: catName,
    num: course.length,
    page_numbers,
    next_page,
    prev_page
  });
});

exports.getTeacherProfile = catchAsync(async (req, res, next) => {
  try {
    const userID = req.user.id;

    const user = await User.findById(userID).lean();
   
      const courses = await Course.find({ teacherID: userID }).lean({ virtuals: true });
   
      
    res.status(200).render("profile", {
      title: "Profile",
      user: user,
      courses: courses,
      numCourse: courses.length
    });
  } catch (error) {
    console.log(error);
  }


});

exports.getStudentProfile = catchAsync(async (req, res, next) => {

  const userID = req.user.id;
  const user = await User.findById(userID).lean();
  const course = await registeredCourse.findOne({ userID: userID }).lean({ virtuals: true });
  let categories = Course.schema.path('category').enumValues; // Get all enum values of category
  if (course != null)
    res.status(200).render("student_profile", {
      title: "Profile",
      user: user,
      courses: course.courses,
      numCourses: course.courses.length,
      categories: categories
    });
  else
    res.status(200).render("student_profile", {
      title: "Profile",
      user: user,
      course: null,
      numCourses: 0,
      categories: categories
    })

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
      for(let i = 0; i< cart.length; i++)
      {
        courses.push(await Course.findOne({slug: cart[i]}).lean());
      }

      courses.forEach(element => {
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
      totalPrice: totalPrice
    });
  } catch (error) {
    console.log(error);
  }

});

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    res.locals.user._id,
    {
      name: req.body.name,
      email: req.body.email
    },
    {
      new: true,
      runValidators: true
    }
  );
  await updatedUser.save();
  res.locals.user = updatedUser;
  res.redirect('/student-profile/edit');
});