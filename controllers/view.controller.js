const Course = require("./../model/course.model");
const catchAsync = require("./../utils/catchAsync");
const User = require("./../model/user.model")
const moment = require("moment");
const axios = require("axios");
const registeredCourse = require('./../model/registedCourse.model');
const { get } = require("mongoose");

exports.getOverview = catchAsync(async (req, res, next) => {
  console.log(req.session)
  const topViewedCourses = await Course.find({}, { _id: 0, __v: 0, }).sort({ "views": -1 }).limit(10).lean({ virtuals: true });

  const topNewestCourses = await Course.find({}, { _id: 0, __v: 0, }).sort({ "createdAt": -1 }).limit(10).lean({ virtuals: true });

  const topTrending = await Course.find({}, { _id: 0, __v: 0, }).sort({ "ratingsAverage": 1, 'createdAt': -1 }).limit(5).lean({ virtuals: true });

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
  try {
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

    console.log(isPurchase);
    course.views++;
    res.status(200).render("course_detail_view", {
      title: course.name,
      course: course,
      user: user,
      isPurchase: isPurchase
    });
  } catch (error) {
    console.log(error);
  }
});

exports.getFilteredCourses = catchAsync(async (req, res, next) => {
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


      user: user,

    });
  } else {
    res.render("error");
  }
})




exports.ProByCat = catchAsync(async (req, res, next) => {
  const catName = req.param('catName');
  const course = await Course.find({ category: catName })
    .lean({ virtuals: true });

  let user = res.locals.user;

  if (user) user = { name: user.name, email: user.email, role: user.role };

  res.status(200).render("search_result", {
    title: catName,
    course: course,
    user: user,
    empty: course === null,
    categories: catName,
    num: course.length
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
  try {

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
  } catch (error) {
    console.log(error)
  }


})