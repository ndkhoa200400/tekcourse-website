const express = require('express');
const controller = require('../controllers/course.controller')
const authController = require('../controllers/auth.controller')
const upload = require("../utils/multer");
const router = express.Router();

const lectureRoute = require('./lecture.route');
const feedbackRoute = require('./feedback.route');


router.use('/:slug/lecture', lectureRoute); // For URL: /courseID/lecture/ID...
router.use('/:slug/feedback', feedbackRoute); // For URL: /courseID/feedback/ID...


//router.get('/search', controller.getFilteredCourses);
router.route('/category/:category').get(controller.getCategory);

router.route('/')
    .get(controller.getAllCourse)
    .post(authController.protect,
        authController.restrictTo('teacher'),
        upload.single('promotionalVideo'),
        controller.createCourse);


router.route('/:id')
    .get(controller.getCourse)
    .patch(authController.protect,
        authController.restrictTo('teacher'),
        controller.updateCourse)
    .delete(authController.protect,
        authController.restrictTo('teacher', 'admin'),
        controller.deleteCourse);

module.exports = router;