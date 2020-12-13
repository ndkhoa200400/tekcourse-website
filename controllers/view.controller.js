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
    .lean({virtuals:true});
  let user = res.locals.user;
  
  if (user) user = { name: user.name, email: user.email, role: user.role };
  res.status(200).render("home", {
    title: "Home",
    user: user,
    courses: courses,
  });
});
