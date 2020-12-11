const express = require('express');
const controller = require('./../controllers/view.controller');

var hbs = require('hbs');

const router = express.Router();
router.use(express.static('public'));
hbs.registerPartials(__dirname + '../views/partials');

router.get('/', controller.getOverview);


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