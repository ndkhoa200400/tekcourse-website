const mongoose = require("mongoose");
const Course = require("./course.model");

const watchlistSchema = new mongoose.Schema(
  {
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

watchlistSchema.index({ user: 1 }, { unique: true });

const Watchlist = mongoose.model("Watchlist", watchlistSchema);

module.exports = Watchlist;
