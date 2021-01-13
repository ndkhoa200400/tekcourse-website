const express = require("express");
const controller = require("../controllers/lecture.controller");
const authController = require("../controllers/auth.controller");
const router = express.Router({mergeParams: true});
const upload = require("../utils/multer");
// coruse/:slug/lecture
// or
// api/lecture
router
  .route("/add")
  .post(
    authController.protect,
    authController.restrictTo("teacher"),
    //controller.setCourseID,
    upload.single('reference'),
    controller.createLecture
  );

router.use(authController.protect);
router.use(authController.allowedToLecture);
router
  .route("/:id")
  .get(controller.getLecture)
  .patch(authController.restrictTo("teacher"), controller.updateLecture)
  .delete(
    authController.restrictTo("teacher", "admin"),
    controller.deleteLecture
  );

module.exports = router;
