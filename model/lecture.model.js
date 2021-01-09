const mongoose = require("mongoose");
const slugify = require("slugify");
const lectureSchema = new mongoose.Schema({
  slug: String,
  name: {
    type: String,
    required: [true, "A lecture must have a name"],
    trim: true,
    unique: true
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
