const express = require("express"); 
const controller = require("../controllers/feedback.controller"); 
const router = express.Router( {mergeParams:true }); 
const authController = require("../controllers/auth.controller"); 

//  URL /tourId/feedback

router
  .route("/")
  .get(controller.getAllFeedbacks)
  .post(authController.protect, 
    authController.restrictTo("customer"), 
    controller.setCourseUserIds, 
    controller.createFeedback
  ); 


router
  .route("/:id")
  .get(controller.getFeedback)
  .delete(authController.restrictTo("customer", "admin"), controller.deleteFeedback)
  .patch(authController.restrictTo("customer", "admin"), controller.updateFeedback); 
module.exports = router; 
