const Course = require("./../model/course.model");
const User = require("./../model/user.model");
const WatchList = require("./../model/watchlist.model");
const catchAsync = require("./../utils/catchAsync");
const axios = require("axios");
const registeredCourse = require("./../model/registedCourse.model");
const pagination = require("./../utils/pagination");
const url = require('url');

exports.getOverview = catchAsync(async (req, res, next) => {
  try {
    let date = new Date();
    let weekAgo = new Date().setDate(date.getDate()-7)

    const topViewedCourses = await Course.find({}, { _id: 0, __v: 0 })
      .sort({ views: -1 })
      .limit(10)
      .lean({ virtuals: true });

    const topNewestCourses = await Course.find({}, { _id: 0, __v: 0 })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean({ virtuals: true });

    const topTrending = await Course.find({}, { _id: 0, __v: 0 })
      .sort({ ratingsAverage: 1, createdAt: -1 })
      .limit(5)
      .lean({ virtuals: true });

    //top lĩnh vực được đăng ký học nhiều nhất trong tuần qua
    const subcategories = await Course.find({createdAt: {$gt: weekAgo, $lt:date}}).sort({ views: -1 }).limit(5)
      .distinct("subcategory")
      .lean({ virtuals: true });


    const topPurchasedCourses = await Course.find({}, { _id: 0, __v: 0 })
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

exports.getCourse = catchAsync(async (req, res, next) => {
  const slugName = req.params.slug;
  const course = await Course.findOneAndUpdate({ slug: slugName }, { $inc: { views: 1 } }).lean({ virtuals: true });
  const feedbacks = await Course.find({}, {}); //danh sách các feedbacks của 1 khoá học (bao gồm: studentName, timeFeedback, rating(số nguyên từ 1-5), feedbackContent)
  let isPurchase = false;
  let isWatched = false;
  let feedbackable = false; //student after registered course could review that course.
  if (!course) {
    res.redirect("back");
    return;
  }

  let user = res.locals.user;


  if (user.role === 'customer') {
    const registeredcouse = await registeredCourse.findOne({ userID: user.id, courses: course.id });
    if (registeredcouse)
      isPurchase = true;
    const watchlist = await WatchList.findOne({ userID: user.id, courses: course.id });

    if (watchlist)
      isWatched = true;
  }

  if (user) user = { name: user.name, email: user.email, role: user.role };
  if (user.role === 'customer' && registeredCourse) {
    reviewable = true;
  }
  course.views++;
  const topTrending = await Course.find({slug: {$ne: slugName}}, { _id: 0, __v: 0 })
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
    feedbackable: feedbackable,
    feedbacks: feedbacks,
  });

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

    res.status(200).render("profile", {
      title: "Profile",
      user: user,
      courses: courses,
      numCourse: courses.length,
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
  let user = res.locals.user;
  const watchlist = await WatchList
    .findOne({ userID: user.id })
    .lean({ virtuals: true });

  res.status(200).render("favourite_courses", {
    title: "My Wish List",
    user: user,
    watchlist: watchlist.courses,
    numCourses: watchlist.courses.length,
  });
});

exports.editStudentProfile = catchAsync(async (req, res, next) => {
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

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    res.locals.user._id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  await updatedUser.save();
  res.locals.user = updatedUser;
  res.redirect("/student-profile/edit");
});
