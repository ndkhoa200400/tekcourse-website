const mongoose = require("mongoose");

const registeredCourseSchema = new mongoose.Schema(
  {
    courses: [{
      type: mongoose.Schema.ObjectId,
      ref: "Course",
    }],
    userID: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true,'Registered Course must belong to a customer']
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

// registeredCourseSchema.pre(/^find/, function(next){
//   this.populate({
//     path:'user',
//     select:'name'
//   })
// })

const RegisteredCourse = mongoose.model("RegisteredCourse", registeredCourseSchema);

module.exports = RegisteredCourse;
