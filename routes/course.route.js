const express = require('express');
const controller = require('../controllers/course.controller')
const authController = require('../controllers/auth.controller')
const upload = require("../utils/multer");
const router = express.Router();

const lectureRoute = require('./lecture.route');
const feedbackRoute = require('./feedback.route');


router.use('/:slug/lecture', lectureRoute); // For URL: /courseSlug/lecture/...
router.use('/:slug/feedback', feedbackRoute); // For URL: /courseID/feedback/ID...


//router.get('/search', controller.getFilteredCourses);
router.route('/category/:category').get(controller.getCategory);
//
router.route('/')
    .get(controller.getAllCourse)
    .post(authController.protect,
        authController.restrictTo('teacher'),
        upload.single('promotionalVideo'),
        controller.createCourse);
router.post('/:id/edit', authController.protect,
        authController.restrictTo('teacher'), 
        upload.single('promotionalVideo'), 
        controller.updateCourse)

router.route('/:id')
    .patch(authController.protect,
        authController.restrictTo('teacher'),
        controller.updateCourse)
 

module.exports = router;