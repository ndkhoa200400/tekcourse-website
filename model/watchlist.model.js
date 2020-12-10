const mongoose = require("mongoose");

const watchlistSchema = new mongoose.Schema(
  {
    courseID: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    userID: {
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
