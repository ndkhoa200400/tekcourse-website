const RegisteredCourse = require('./../model/registedCourse.model');
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')
const factory = require('./handlerFactory')
const Course = require('../model/course.model');
exports.getAllRegisteredCourse = factory.getAll(RegisteredCourse);
exports.getCourse = factory.getOne(Course);

exports.registerManyCourses = catchAsync(async (req, res, next) => {

    try {
        const userID = req.user.id;

        const coursesSlugName = req.session.cart;

        if (coursesSlugName) {
            let registersedCourse = await RegisteredCourse.findOne({ userID: userID });
            if (!registersedCourse) {

                registersedCourse = await RegisteredCourse.create({ userID: userID, courses: [] });
            }
            for (let i = 0; i < coursesSlugName.length; i++) {

                let selectedCourse = await Course.findOne({ slug: coursesSlugName[i] });
                let isExisted = false;
                if (!selectedCourse) {
                    return next(new AppError("Cannot find this course", 404));
                }

                else {

                    for (let i = 0; i < registersedCourse.courses.length; i++) {
                        if (registersedCourse.courses[i].id === selectedCourse.id) {
                            isExisted = true;
                            break;
                        }
                    }

                }
                if (isExisted) continue;
                registersedCourse.courses.push(selectedCourse.id);
                selectedCourse.updateOne({ $inc: { numStudents: 1 } });
            }

            registersedCourse.save();
            req.session.cart = [];
            res.status(200).json({
                status: 'success',
                data: {
                    doc: registersedCourse
                }
            })
        }
        else {
            res.status(400).json({
                status: 'fail'
            })
        }
    } catch (error) {
        console.log(error);
    }

});

exports.registerNewCourse = catchAsync(async (req, res, next) => {

    const userID = req.user.id;
    const courseSlugName = req.body.courseSlugName;

    const registersedCourse = await RegisteredCourse.findOne({ userID: userID });
    const selectedCourse = await Course.findOne({ slug: courseSlugName });

    if (!selectedCourse) {
        return next(new AppError("Cannot find this course", 404));
    }

    if (!registersedCourse) {


        await RegisteredCourse.create({ userID: userID, courses: [{course: selectedCourse.id}] });
        await selectedCourse.updateOne({ $inc: { numStudents: 1 } });

    }
    else {

        registersedCourse.courses.forEach(element => {
            if (element.course.id === selectedCourse.id)
                return next(new AppError("You already purchased this course", 400));
        });

        registersedCourse.courses.push({course: selectedCourse.id});
        await selectedCourse.updateOne({ $inc: { numStudents: 1 } });
        await registersedCourse.save();
    }
    res.status(200).json({
        status: 'success'
    })
});

exports.updateCourse = factory.updateOne(RegisteredCourse);

exports.deleteCourse = factory.deleteOne(RegisteredCourse);

