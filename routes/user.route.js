const express = require("express");
const authController = require("../controllers/auth.controller");
const controller = require("../controllers/user.controller");

const router = express.Router();
router.use(express.static('public'));

router.post("/signup", authController.signup);
// router.get('/signup', function (req, res) {
//   res.render('sign_up');
// })

router.post('/login', authController.login);
router.get('/login', function (req, res) {
    res.render('sign_in');
  })

// router.get('/logout', authController.logout);
// router.route("/login").get((req,res)=> {
//   res.render('sign_in')
// }).post(authController.login);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:id", authController.resetPassword);

// Protect all routers after this middleware
router.use(authController.protect);

router.patch("/updateMyPassword", authController.updatePassword);
router.get("/me", controller.getMe, controller.getUser);
router.patch("/updateMe", controller.updateMe);
router.delete("/deleteMe", controller.deleteMe);

// Only admin can use these routes
router.use(authController.restrictTo("admin"));
router.route("/").get(controller.getAllUsers);

router.post("/teacher", authController.createTeacherAccount);

router
  .route("/:id")
  .get(controller.getUser)
  .patch(controller.updateUser)
  .delete(controller.deleteUser);


module.exports = router;
