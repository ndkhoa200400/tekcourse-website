const express = require("express");
const authController = require("../controllers/auth.controller");
const controller = require("../controllers/user.controller");

const router = express.Router();
router.post("/signup/otp", authController.otp);
router.post("/signup/resendOtp", authController.resendOtp);
router.get('/signup/otp', (req, res) => {
  console.log(req.session)
  res.render('otp_page', {
    title: 'OTP Authentication',
    layout: false,
    message: "",
    email: req.session.register.body.email,

  })
});
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:id", authController.resetPassword);
router.get("/logout", authController.logout)
// Protect all routers after this middleware
router.use(authController.protect);

router.patch("/updatePassword", authController.updatePassword);
router.get("/me", controller.getMe, controller.getUser);
// router.post("/student-profile/edit", controller.updateMe);
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
