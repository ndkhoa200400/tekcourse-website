const mongoose = require("mongoose");

const lectureSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A lecture must have a name"],
    trim: true,
    maxlength: [40, "A lecture name must have less or equal 40 characters"],
    minlength: [5, "A lecture name must have more or equal 5 characters"],
  },
  length: {
    type: Date,
  },
  description: String,
  video: {
    type: String,
  },
  reference: {
    type: String,
  },
});

const Lecture = mongoose.model("Lecture", lectureSchema);

module.exports = Lecture;
