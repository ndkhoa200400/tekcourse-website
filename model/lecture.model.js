const mongoose = require("mongoose");
const slugify = require("slugify");
const lectureSchema = new mongoose.Schema({
  courseID: {
    type: mongoose.Schema.ObjectId,
    ref: "Course",
    require: [true, "A lecture must belong to a course"],
  },
  slug: String,

  name: {
    type: String,
    required: [true, "A lecture must have a name"],
    trim: true,
    maxlength: [40, "A lecture name must have less or equal 40 characters"],
    minlength: [5, "A lecture name must have more or equal 5 characters"],
  },
  length: {
    type: String,
  },
  description: String,
  video: {
    type: String,
  },
  reference: {
    type: String,
  },
});

lectureSchema.pre('save', function(next){
  this.slug = slugify(this.name, {lower:true});
  next();
})
const Lecture = mongoose.model("Lecture", lectureSchema);

module.exports = Lecture;
