const Course = require('./../model/course.model');
const catchAsync = require('./../utils/catchAsync');




exports.getOverview = catchAsync(async (req,res,next)=>{
  const course = await Course.find();

  res.status(200).render('home', {
    title: 'Home',
    course
  })

})