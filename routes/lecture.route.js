const express = require("express");
const controller = require("../controllers/lecture.controller");
const authController = require("../controllers/auth.controller");
const router = express.Router({ mergeParams: true });
const upload = require("../utils/multer");
// course/:slug/lecture/...
// or
// api/lecture



router.post('/:content/:lecture/edit', authController.protect,authController.restrictTo("teacher"), upload.single('reference'), controller.editLecture);

router
  .route("/add")
  .post(
    authController.protect,
    authController.restrictTo("teacher"),
    //controller.setCourseID,
    upload.single('reference'),
    controller.createLecture
  );



module.exports = router;
