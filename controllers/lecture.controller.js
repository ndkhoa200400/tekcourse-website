const Lecture = require('./../model/lecture.model');
const Course = require('./../model/course.model');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory')

exports.setCourseID = catchAsync(async(req,res,next) => {
    // Tạo một lecture thì phải có course ID 
    if(!req.body.courseID) req.body.courseID= req.params.courseID;
    
    next(); 
});

exports.getAllLectures = factory.getAll(Lecture);

exports.getLecture = factory.getOne(Lecture);

exports.createLecture = factory.createOne(Lecture);

exports.updateLecture = factory.updateOne(Lecture);

exports.deleteLecture = factory.deleteOne(Lecture);

