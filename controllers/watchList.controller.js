const WatchList = require('./../model/watchlist.model');
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')
const factory = require('./handlerFactory')
const Course = require('../model/course.model');
exports.addToWatchList = catchAsync(async (req, res, next) => {

    const userID = req.user.id;
    const courseSlugName = req.body.courseSlugName;

    const course = await WatchList.findOne({ userID: userID });
    const selectedCourse = await Course.findOne({ slug: courseSlugName });

    if (!selectedCourse) {
        return next(new AppError("Cannot find this course", 404));
    }

    if (!course) {

        await WatchList.create({ userID: userID, courses: [selectedCourse.id] });
        //await selectedCourse.updateOne({ $inc: { numStudents: 1 } });
    }
    else {
        let isExisted = false;
        let index = -1;
        for (let i = 0; i < course.courses.length; i++) {
            if (course.courses[i].id === selectedCourse.id) {
                isExisted = true;
                index = i;
                break;
            }
        }
        if (isExisted) {
            course.courses.splice(index, 1);
        }
        else{

            registersedCourse.courses.push(selectedCourse.id);
        }
    
        await registersedCourse.save();
    }
    res.status(200).json({
        status: 'success'
    })
});