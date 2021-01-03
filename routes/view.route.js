const express = require('express');
const controller = require('./../controllers/view.controller');
const authController = require('./../controllers/auth.controller')
var hbs = require('hbs');
const Course = require('../model/course.model');

const router = express.Router();
router.use(express.static(__dirname + 'public'));
hbs.registerPartials(__dirname + '../views/partials');


router.use(authController.isLoggedIn);

router.use(controller.getSessionCart);

router.get('/', controller.getOverview);

router.get('/course/search', controller.getFilteredCourses);
// localhost:8000/category/mobile??duration=long&ratings=4.5&sort=highest-rated

router.get('/category/:catName', controller.ProByCat);

router.get('/student-profile', authController.protect, controller.getStudentProfile)

router.get('/profile', authController.protect, controller.getTeacherProfile);

router.get('/course/create-new-course', (req, res) => {

  let user = res.locals.user;

  if (user) user = { name: user.name, email: user.email, role: user.role };
  res.render('create_new_course', {
    title: "Create New Course",
    user: user
  })
})

router.get('/course/:slug', controller.getCourse);

router.get('/signup', (req, res) => {
  res.render('sign_up', {
    title: 'Sign up'
  })
})

router.get('/login', (req, res) => {
  res.render('sign_in', {
    title: 'Login'
  });
})

//test check-out page
router.get('/check-out', (req, res) => {
  res.render('check_out', {
    title: 'Thank you'
  });
});

router.get('/instructor', (req, res) => {
  res.render('instructor_courses')
})


module.exports = router;