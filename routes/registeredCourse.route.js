
const express = require('express');
const controller = require('../controllers/registeredCourse.controller')
const authController = require('../controllers/auth.controller')
const router = express.Router();

router.use(authController.protect);
router.route('/')
    .get(controller.getAllRegisteredCourse)
    .post(
        controller.registerNewCourse)

router.post('/many', controller.registerManyCourses)


module.exports = router;