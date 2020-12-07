const Lecture = require('./../model/lecture.model');
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

exports.getAllLecture = factory.getAll(Lecture);

exports.getLecture = factory.getOne(Lecture);

exports.createLecture = factory.createOne(Lecture);

exports.updateLecture = factory.updateOne(Lecture);

exports.deleteLecture = factory.deleteOne(Lecture);

