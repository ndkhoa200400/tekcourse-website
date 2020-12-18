const express = require('express');
const controller = require('./../controllers/view.controller');
const authController = require('./../controllers/auth.controller')
var hbs = require('hbs');

const router = express.Router();
router.use(express.static(__dirname +'public'));
hbs.registerPartials(__dirname + '../views/partials');


router.use(authController.isLoggedIn);


router.get('/', controller.getOverview);

router.get('/category',(req, res)=>{
  res.render('search_result',{
    title : "Category"
  })
} );

router.get('/profile',(req, res)=>{
  res.render('profile',{
    title : "My Profile"
  })
} );

router.get('/course/create-new-course', (req, res)=>{
  res.render('create_new_course',{
    title: "Create new course"
  })
})

router.get('/course/:slug', controller.getCourse);

router.get('/signup', (req, res)=>{
  res.render('sign_up',{
    title:'Sign up'
  })
})

router.get('/login', (req,res)=>{
  res.render('sign_in',{
    title: 'Login'
  });
})


module.exports = router;