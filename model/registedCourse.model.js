const mongoose = require("mongoose");

const registedCourseSchema = new mongoose.Schema(
  {
    courseID: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    }],
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    registedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

registedCourseSchema.pre(/^find/, function(next){
  this.populate({
    path:'user',
    select:'name'
  })
})

const RegistedCourse = mongoose.model("RegistedCourse", registedCourseSchema);

module.exports = RegistedCourse;
