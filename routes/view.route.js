const express = require('express');
const viewsController = require('../controllers/view.controller');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.use(viewsController.alerts);

router.get('/login', authController.login, viewsController.getLoginForm);

// router.post(
//   '/submit-user-data',
//   authController.protect,
//   viewsController.updateUserData
// );

module.exports = router;