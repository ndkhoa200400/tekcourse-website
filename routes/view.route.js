const express = require('express');
const controller = require('./../controllers/view.controller');
const authController = require('./../controllers/auth.controller')
const watchlistController = require('./../controllers/watchList.controller');
const userController = require('./../controllers/user.controller');
var hbs = require('hbs');
const Course = require('../model/course.model');
const User = require("./../model/user.model")

const router = express.Router();
router.use(express.static(__dirname + 'public'));
hbs.registerPartials(__dirname + '../views/partials');


router.use(authController.isLoggedIn);

router.use(controller.getSessionCart);

router.get('/', controller.getOverview);

router.get('/student-profile', authController.protect, controller.getStudentProfile)

router.get('/student-profile/wishlist', authController.protect, controller.getStudentWatchedList)

router.post('/student-profile/wishlist', watchlistController.removeCourse);


// router.get('/student-profile/wishlist', authController.protect, controller.getStudentWatchedList);

router.get('/profile', authController.protect, controller.getTeacherProfile);

router.get('/instructor-profile', controller.getInstructorView);
//router.get('/profile/edit', authController.protect, controller.updateTeacherProfile);

router.get('/course/create-new-course', controller.createNewCourse)


router.get("/student-profile/edit", authController.protect, controller.editProfile);

router.post("/student-profile/edit", authController.protect, userController.updateMe);

router.get("/profile/edit", authController.protect, controller.editProfile);

router.post("/profile/edit", authController.protect, userController.updateMe);

router.get('/course/:slug', controller.getCourse);


router.get('/course/:slug/edit', controller.editCourse);

router.get('/course/:slug/:content/:lecture/edit', authController.protect,authController.restrictTo('teacher'),controller.editLecture);

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

router.get('/instructor', async (req, res) => {
  let user = res.locals.user;
  const courses = await Course.find({ teacherID: user.id }).lean({
    virtuals: true,
  });

  if (user) user = { name: user.name, email: user.email, role: user.role };
  res.render('instructor_courses',{
    user :user,
    layout: 'main_teacher',
    title : 'Create A Course',
    courses: courses
  })
});

//router.get('/instructor/:slug/:lecture/edit', controller.editLecture);

module.exports = router;