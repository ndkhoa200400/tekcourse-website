const mongoose = require("mongoose");

const watchlistSchema = new mongoose.Schema(
  {
    courseID: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Course",
      },
    ],
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

watchlistSchema.index({courseID: 1, userID: 1 }, { unique: true });

const Watchlist = mongoose.model("Watchlist", watchlistSchema);

module.exports = Watchlist;
