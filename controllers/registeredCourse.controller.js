const RegisteredCourse = require('./../model/registedCourse.model');
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')
const factory = require('./handlerFactory')
const Course = require('../model/course.model');
exports.getAllRegisteredCourse = factory.getAll(RegisteredCourse);
exports.getCourse = factory.getOne(Course);

exports.registerNewCourse = catchAsync(async (req, res, next) => {



    const userID = req.user.id;
    console.log(userID)
    const courseSlugName = req.body.courseSlugName;
    console.log(courseSlugName)
  
        const registersedCourse = await RegisteredCourse.findOne({ userID: userID });
        const selectedCourse = await Course.findOne({ slug: courseSlugName });
        console.log(registersedCourse)
  
   
    if (!selectedCourse)
    {
        return next(new AppError("Cannot find this course", 404));
    }
  
    if (!registersedCourse) {
        course = await RegisteredCourse.create({ userID: userID, courses: [selectedCourse.id] });
    }
    else {
        if (!registersedCourse.courses.includes(selectedCourse.id)) {
            registersedCourse.courses.push(selectedCourse.id);
            course = await registersedCourse.save();
        }
        else {
            return next(new AppError("You already purchased this course", 400));
        }
    } 


    res.status(200).json({
        stauts: 'success',
        data: {
            doc: course
        }
    })

})

exports.updateCourse = factory.updateOne(RegisteredCourse);

exports.deleteCourse = factory.deleteOne(RegisteredCourse);

