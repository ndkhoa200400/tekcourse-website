const RegisteredCourse = require('./../model/registedCourse.model');
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')

exports.getAllRegisteredCourse = factory.getAll(Course);
exports.getCourse = factory.getOne(Course);

exports.registerNewCourse =  catchAsync(async(req, res, next)=>{
    const userID = req.user.id;
    const courseID = req.body.courseID;
    const registersedCourse = await RegisteredCourse.find({userID:userID});
    let course;
    if (!registersedCourse)
    {
        course = await RegisteredCourse.create({userID: userID, courses:[courseID]});
    }
    else{
        registersedCourse.courses.push(courseID);
        course = await registersedCourse.save();
    }
    res.status(200).json({
        stauts:'success',
        data: {
            doc: course
        }
    })
    
})

exports.updateCourse = factory.updateOne(Course);

exports.deleteCourse = factory.deleteOne(Course);

