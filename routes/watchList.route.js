
const express = require('express');
const controller = require('../controllers/watchList.controller')
const authController = require('../controllers/auth.controller')
const router = express.Router();

router.use(authController.protect);
router.post('/add', controller.addToWatchList)

module.exports = router;