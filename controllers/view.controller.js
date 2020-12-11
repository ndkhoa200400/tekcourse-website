const Course = require('./../model/course.model');
const catchAsync = require('./../utils/catchAsync');




exports.getOverview = catchAsync(async (req,res,next)=>{
  const course = await Course.find();
  let user = res.locals.user;
  user = {name: user.name,email: user.email,role: user.role};
  res.status(200).render('home', {
    title: 'Home',
    user: user,
    course
  })

})