const Course = require('./../model/course.model');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory')

exports.setTeacherID = catchAsync(async(req,res,next) => {

    req.body.teacherID = req.user.id;
   
    next(); 
});

exports.getAllCourse = factory.getAll(Course);

exports.getCourse = factory.getOne(Course);

exports.createCourse = factory.createOne(Course);

exports.updateCourse = factory.updateOne(Course);

exports.deleteCourse = factory.deleteOne(Course);

