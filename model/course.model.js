const mongoose = require("mongoose");
const slugify = require("slugify");
const moment = require('moment');
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');
const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A course must have a name"],
    trim: true,
    minlength: [5, "A course name must have more or equal 5 characters"],
  },
  slug: {
    type: String,
  },
  price: {
    type: Number,
    required: [true, "A course must have a price"],
  },
  discount: Number,
  avatar: String,
  description: String,
  shortDescription: String,
  ratingsAverage: {
    type: Number,
    default: 0,
    set: (val) => Math.round(val * 10) / 10,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  numStudents: {
    type: Number,
  },
  teacherID: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "A course belongs to a teacher"],
  },
  category: {
    type: String,
    required: [true, "Please provide category of course"],
    enum: ["mobile", "website"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  views:{
    type: Number,
    default: 0
  }
},{
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

courseSchema.virtual("lectures", {
  ref: "Lecture",
  foreignField: "course",
  localField: "_id",
});


courseSchema.virtual("createdDate").get(function(){
  return moment(this.createdAt).format("DD-MM-YYYY");
});

courseSchema.virtual("lastUpdatedDate").get(function(){
  return moment(this.lastUpdated).format("DD-MM-YYYY");
});


courseSchema.virtual("categoryName").get(function(){
  if (this.category === "website")
    return "Web Development"
  else
    return "Mobile Development"
});

courseSchema.post("findOneAndUpdate", async function () {
  // Sau khi cap nhat thi sua ten slug, va ngay cap nhat
  const updatedDoc = await this.model.findOne(this.getQuery());
  await this.model.updateOne(this.getQuery(), {
    slug: slugify(updatedDoc.name, { lower: true }),
    lastUpdated: Date.now(),
  });
});

courseSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

courseSchema.plugin(mongooseLeanVirtuals);
const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
