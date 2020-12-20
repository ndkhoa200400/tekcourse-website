const Course = require("./../model/course.model");
const catchAsync = require("./../utils/catchAsync");
const moment = require("moment");

exports.getOverview = catchAsync(async (req, res, next) => {
  const courses = await Course.find(
    {},
    {
      _id: 0,
      __v: 0,
    }
  )
    .populate({
      path: "teacherID",
      select: "-__v -passwordChangedAt -_id",
    })
    .lean({ virtuals: true });
  const categories = await Course.find({})
  .populate('category')
  .distinct('category')
  .lean({ virtuals: true });
  
  let user = res.locals.user;
  console.log(categories);
  if (user) user = { name: user.name, email: user.email, role: user.role };
  res.status(200).render("home", {
    title: "Home",
    user: user,
    courses: courses,
    categories: categories
  });
});

exports.getCourse = catchAsync(async (req, res, next) => {
  const slugName = req.params.slug;
  const course = await Course.findOneAndUpdate({ slug: slugName }, {$inc: {views: 1}})
    .populate({
      path: "teacherID",
      select: "-__v -passwordChangedAt -_id",
    })
    .lean({ virtuals: true });

  if (!course) {
    res.redirect("/");
    return;
  }
  let user = res.locals.user;

  if (user) user = { name: user.name, email: user.email, role: user.role };
  course.views ++;
  res.status(200).render("course_detail_view", {
    title: course.name,
    course: course,
    user: user
  });
});

exports.ProByCat = catchAsync(async (req, res, next) => {
  const catName = req.param('catName');
  const course = await Course.find({ category: catName })
    .lean({ virtuals: true });
  const categories = await Course.find({})
  .populate('category')
  .distinct('category')
  .lean({ virtuals: true });

  console.log(categories);

  let user = res.locals.user;
  
  if (user) user = { name: user.name, email: user.email, role: user.role };
  console.log(course);
  res.status(200).render("search_result", {
    title: catName,
    course: course,
    user: user,
    empty : course === null,
    categories: categories
    // num : course thả chổ để length course cho tao!
  });
});