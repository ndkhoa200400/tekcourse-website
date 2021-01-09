const Feedback = require('./../model/feedback.model');
//const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory')

exports.getAllFeedbacks = factory.getAll(Feedback);

exports.setCourseUserIds = (req, res, next) =>{
    if(!req.body.userID) req.body.userID = res.locals.user.id;
    if(!req.body.courseID) req.body.courseID = req.user.courseID;
    next();
}

exports.createFeedback = async(req, res, next)=>{
    try {
        const feedback = await Feedback.create(req.body);

        res.status(200).redirect('back');
    } catch (error) {
        res.status(400).send(`
        <script>
            alert("${error.message}")
            window.location.reload();
        </script>
        `)
        console.log(error);
    }
}

exports.deleteFeedback = factory.deleteOne(Feedback);

exports.updateFeedback = factory.updateOne(Feedback);

exports.getFeedback = factory.getOne(Feedback);