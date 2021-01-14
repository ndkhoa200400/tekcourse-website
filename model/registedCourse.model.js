const mongoose = require("mongoose");

const registeredCourseSchema = new mongoose.Schema(
  {
    courses: [{
        course: {
          type: mongoose.Schema.ObjectId,
          ref: "Course",

        },
        registeredAt: {
          type: Date,
          default: Date.now,
        }
      }],
    userID: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, 'Registered Course must belong to a customer']
    },

  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

registeredCourseSchema.index({ userID: 1, courses: 1 })

registeredCourseSchema.pre(/^find/, function () {
  this.populate('courses.course')
})

const RegisteredCourse = mongoose.model("RegisteredCourse", registeredCourseSchema);

module.exports = RegisteredCourse;
