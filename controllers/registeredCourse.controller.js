const RegisteredCourse = require('./../model/registedCourse.model');
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')
const factory = require('./handlerFactory')
const Course = require('../model/course.model');
exports.getAllRegisteredCourse = factory.getAll(RegisteredCourse);
exports.getCourse = factory.getOne(Course);

exports.registerNewCourse = catchAsync(async (req, res, next) => {


    const userID = req.user.id;
    const courseSlugName = req.body.courseSlugName;

    const registersedCourse = await RegisteredCourse.findOne({ userID: userID });
    const selectedCourse = await Course.findOne({ slug: courseSlugName });

    if (!selectedCourse) {
        return next(new AppError("Cannot find this course", 404));
    }

    if (!registersedCourse) {
        course = await RegisteredCourse.create({ userID: userID, courses: [selectedCourse.id] });
    }
    else {

        registersedCourse.courses.forEach(element => {
            if (element.id === selectedCourse.id)
                return next(new AppError("You already purchased this course", 400));
        });

        registersedCourse.courses.push(selectedCourse._id);
        selectedCourse.updateOne({ $inc: { numStudents: 1 } });
        registersedCourse.save();

    }
    res.status(200).json({
        status: 'success',
        data: {
            doc: registersedCourse
        }
    })





})

exports.updateCourse = factory.updateOne(RegisteredCourse);

exports.deleteCourse = factory.deleteOne(RegisteredCourse);

