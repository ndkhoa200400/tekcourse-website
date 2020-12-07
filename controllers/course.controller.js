const Course = require('./../model/course.model');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory')

// exports.getCourse = catchAsync(async(req,res,next) => {
//     const sellerID = req.user.id;
//     const shop = await Shop.find({sellerID: sellerID});

//     req.body.shopID = shop[0]._id;
//     console.log(shop[0]._id);
//     console.log(req.body);
//     next(); // pass to getUser function
// });

exports.getAllCourse = factory.getAll(Course);

exports.getCourse = factory.getOne(Course);

exports.createCourse = factory.createOne(Course);

exports.updateCourse = factory.updateOne(Course);

exports.deleteCourse = factory.deleteOne(Course);

