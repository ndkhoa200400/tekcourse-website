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
  avatar: {
    type: String,
    default: ""
  },
  promotionalVideo: {
    type: String,
    default: ""
  },
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
    default: 0
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
  subcategory: {
    type: String,
    default: "none"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  views: {
    type: Number,
    default: 0
  },
  contents: [{
    name: {
      type: String,
      trim: true
    },
    lectures: [{
      type: mongoose.Schema.ObjectId,
      ref: 'Lecture'
    }]
  }],
  isCompleted: {
    type: Boolean,
    default: false
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

courseSchema.index({ slug: 1 });

courseSchema.index({ teacherID: 1 });

courseSchema.index({ name: 'text', description: 'text' });


courseSchema.virtual("createdDate").get(function () {
  return moment(this.createdAt).format("DD-MM-YYYY");
});

courseSchema.virtual("lastUpdatedDate").get(function () {
  return moment(this.lastUpdated).format("DD-MM-YYYY");
});


courseSchema.virtual("categoryName").get(function () {
  if (this.category === "website")
    return "Web Development"
  else
    return "Mobile Development"
});

courseSchema.post("findOneAndUpdate", async function () {
  // Sau khi cap nhat thi sua ten slug, va ngay cap nhat
  const updatedDoc = await this.model.findOne(this.getQuery());
  if (!updatedDoc) return;
  if (updatedDoc.name)
    await this.model.updateOne(this.getQuery(), {
      slug: slugify(updatedDoc.name, { lower: true }),
      lastUpdated: Date.now(),
    });
  else{
    await this.model.updateOne(this.getQuery(), {    
      lastUpdated: Date.now(),
    });
  }
});

// courseSchema.pre("updateOne", async function(){
//     await this.model.updateOne(this.getQuery(), {
//       lastUpdated: Date.now()
//     });
// })

courseSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

courseSchema.pre(/^find/, function () {
  this.populate("teacherID");
})

courseSchema.plugin(mongooseLeanVirtuals);
const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
