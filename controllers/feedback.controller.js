const Feedback = require('./../model/feedback.model');
//const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory')

exports.getAllFeedbacks = factory.getAll(Feedback);

exports.setCourseUserIds = (req, res, next) =>{
    if(!req.body.userID) req.body.userID = req.params.userID;
    if(!req.body.courseID) req.body.courseID = req.user.courseID;
    next();
}

exports.createFeedback = factory.createOne(Feedback);

exports.deleteFeedback = factory.deleteOne(Feedback);

exports.updateFeedback = factory.updateOne(Feedback);

exports.getFeedback = factory.getOne(Feedback);