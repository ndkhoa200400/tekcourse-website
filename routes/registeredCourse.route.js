
const express = require('express');
const controller = require('../controllers/registeredCourse.controller')
const authController = require('../controllers/auth.controller')
const router = express.Router();


router.route('/')
    .get(controller.getAllRegisteredCourse)
    .post(authController.protect,
        controller.registerNewCourse)


module.exports = router;