const mongoose = require("mongoose");

const watchlistSchema = new mongoose.Schema(
  {
    courses: [{
      type: mongoose.Schema.ObjectId,
      ref: "Course",

    }],
    userID: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
watchlistSchema.index({ userID: 1, courses: 1 });

watchlistSchema.pre(/^find/, function () {
  this.populate('courses')
})


const Watchlist = mongoose.model("Watchlist", watchlistSchema);

module.exports = Watchlist;
