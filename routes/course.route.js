const express = require('express');
const controller = require('../controllers/course.controller')
const authController = require('../controllers/auth.controller')
const router = express.Router();

router.route('/')
    .get(controller.getAllCourse)
    .post(authController.protect,
        authController.restrictTo('teacher'),
        controller.createCourse);


router.route('/:id')
    .get(controller.getCourse)
    .patch(authController.protect,
        authController.restrictTo('teacher'),
        controller.updateCourse)
    .delete(authController.protect,
        authController.restrictTo('teacher','admin'),
        controller.deleteCourse);

module.exports = router;