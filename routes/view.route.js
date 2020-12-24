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

// test mobile-development category
// router.get('/mobile-development', (req, res) => {
//   res.render('mobile_development', {
//     title: 'All courses of Mobile Development',
//     images: '/images/courses/img-1.jpg',
//     rating: 1000000000,
//     views: -100,
//     createdDate: 15,
//     name: 'Basic Kotlin Tutorial',
//     category: 'Mobile development',
//     teacher: 'MY toda LE',
//     price: 3
//   })
// });
// // test web-development category
// router.get('/web-development', (req, res) => {
//   res.render('web_development', {
//     title: 'All courses of Web Development',
//     images: '/images/courses/img-1.jpg',
//     rating: 1000000000,
//     views: -100,
//     createdDate: 15,
//     name: 'Basic Kotlin Tutorial',
//     category: 'Mobile development',
//     teacher: 'MY toda LE',
//     price: 3
//   })
// })


module.exports = router;