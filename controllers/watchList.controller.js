const WatchList = require('./../model/watchlist.model');
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')
const factory = require('./handlerFactory')
const Course = require('../model/course.model');

exports.addToWatchList = async (req, res, next) => {
    
    try {
        const userID = req.user.id;
        const courseSlugName = req.body.slug;

        const course = await WatchList.findOne({ userID: userID });
        const selectedCourse = await Course.findOne({ slug: courseSlugName });

        if (!selectedCourse) {
            return next(new AppError("Cannot find this course", 404));
        }

        if (!course) {
            await WatchList.create({ userID: userID, courses: [selectedCourse.id] });
       
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
            else {

                course.courses.push(selectedCourse.id);
            }

            await course.save();
        }
        res.redirect('back');
    } catch (error) {
        console.log(error);
    }

};

exports.removeCourse = async (req, res, next) => {
    console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
    let user = res.locals.user;
    const watchlist = await WatchList
  .findOne({ userID: user.id})
  .lean({ virtuals: true });

    const course_id = req.param('remove');
    // console.log(course_id);
    // console.log(watchlist.courses);
    watchlist.courses.pull({ id: course_id });

    await watchlist.save();

    res.redirect('/student-profile/wishlist');
};

