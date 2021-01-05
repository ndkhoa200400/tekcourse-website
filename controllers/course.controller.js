const Course = require('./../model/course.model');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory')

exports.setTeacherID = catchAsync(async(req,res,next) => {

    req.body.teacherID = req.user.id;
   
    next(); 
});

exports.getAllCourse = factory.getAll(Course);

exports.getCourse = factory.getOne(Course);

exports.createCourse = async (req, res, next) =>{
    try {
        const course = await Course.create(req.body);

        res.status(200).send(`
        <script>
            alert('Successfully! Check it out!')
            window.location.replace('/course/${course.slug}');
        </script>
        `)
    } catch (error) {
        res.status(400).send(`
        <script>
            alert('${error.message}')
            window.location.replace('/course/create-new-course');
        </script>
        `)
    }
}

exports.updateCourse = factory.updateOne(Course);

exports.deleteCourse = factory.deleteOne(Course);

