
const mongoose = require('mongoose');
const Course = require('./course.model');

const feedbackSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    courseID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Review must belong to a course.']
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a customer']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

feedbackSchema.index({ Course: 1, user: 1 }, { unique: true });


feedbackSchema.statics.calcAverageRatings = async function(CourseId) {
  const stats = await this.aggregate([
    {
      $match: { Course: CourseId }
    },
    {
      $group: {
        _id: '$course',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);
  // console.log(stats);

  if (stats.length > 0) {
    await Course.findByIdAndUpdate(CourseId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating
    });
  } else {
    await Course.findByIdAndUpdate(CourseId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5
    });
  }
};

feedbackSchema.post('save', function() {
  // this points to current review
  this.constructor.calcAverageRatings(this.Course);
});

// findByIdAndUpdate
// findByIdAndDelete
feedbackSchema.pre(/^findOneAnd/, async function(next) {
  this.r = await this.findOne();
  // console.log(this.r);
  next();
});

feedbackSchema.post(/^findOneAnd/, async function() {
  // await this.findOne(); does NOT work here, query has already executed
  await this.r.constructor.calcAverageRatings(this.r.Course);
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;