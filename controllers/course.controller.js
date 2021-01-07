const Course = require('./../model/course.model');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory')
const cloudinary = require('cloudinary');
const APIFeatures = require("./../utils/apiFeature");
const pagination = require("./../utils/pagination");
exports.setTeacherID = catchAsync(async (req, res, next) => {



    next();
});

exports.getCourse = factory.getOne(Course);


exports.createCourse = async (req, res, next) => {
    try {
        req.body.teacherID = req.user.id;

        if (req.file)
            req.body.promotionalVideo = await cloudinary.v2.uploader.upload(req.file.path, { resource_type: "video", });

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
            alert("${error.message}")
            window.location.replace("/course/create-new-course");
        </script>
        `)
    }
}

exports.getAllCourse = async (req, res) => {

    try {
        // let page = req.query.page || 1;
        // if (page < 1) page = 1;
        // const total = res.data.data.docs.length;

        // const page_numbers = pagination.calcPageNumbers(total, page);
        // const offset = pagination.calcOffset(page);
        // const next_page = pagination.calcNextPage(page, page_numbers);
        // const prev_page = pagination.calcPreviousPage(page, page_numbers);
        let user = res.locals.user;
        if (user) user = { name: user.name, email: user.email, role: user.role };

        const query = req.query;
        const q = query.q || {};

        delete query.q;

        const features = new APIFeatures(Course.find({ $text: { $search: q } }), query)
            .filter()
            .sort();

        let course = await features.query.lean({ virtuals: true });

        const page_numbers = pagination.calcPageNumbers(course.length, page);
        const offset = pagination.calcOffset(page);
        const next_page = pagination.calcNextPage(page, page_numbers);
        const prev_page = pagination.calcPreviousPage(page, page_numbers);
        course = course.slice(offset, (offset + 1) * pagination.limit);
        res.status(200).render("search_result", {
            title: "Results",
            course,
            page_numbers,
            next_page,
            prev_page,
            user: user,
        });
    } catch (error) {
        console.log(error);
    }

};

exports.getCategory = async (req, res) => {
    try {
        let page = req.query.page || 1;
        if (page < 1) page = 1;



        // var total = totalCourse.length;
        const category = req.params.category;

        const features = new APIFeatures(Course.find(req.params), req.query)
            .filter()
            .sort();
        let course = await features.query.lean({ virtuals: true });


        const page_numbers = pagination.calcPageNumbers(course.length, page);
        const offset = pagination.calcOffset(page);
        const next_page = pagination.calcNextPage(page, page_numbers);
        const prev_page = pagination.calcPreviousPage(page, page_numbers);

        let user = res.locals.user;
        if (user) user = { name: user.name, email: user.email, role: user.role };

        course = course.slice(offset, (offset + 1) * pagination.limit);
        res.status(200).render("search_result", {
            title: req.params.category.toUpperCase(),
            course: course,
            user: user,
            empty: course === null,
            categories: category,
            num: course.length,
            page_numbers,
            next_page,
            prev_page,
        });
    } catch (error) {
        console.log(error);
    }
}

exports.updateCourse = factory.updateOne(Course);

exports.deleteCourse = factory.deleteOne(Course);

