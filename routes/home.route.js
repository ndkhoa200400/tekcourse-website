const express = require('express');
var hbs = require('hbs');

const router = express.Router();
router.use(express.static('public'));
hbs.registerPartials(__dirname + '../views/partials');

router.get('/', function (req, res) {
  res.render('home');
})

module.exports = router;