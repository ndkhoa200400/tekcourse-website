const express = require('express');

const router = express.Router();
router.use(express.static('public'));

router.get('/', function (req, res) {
  res.render('home');
})

module.exports = router;