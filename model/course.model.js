const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "A course must have a name"],
        trim: true,
        maxlength: [40, "A course name must have less or equal 40 characters"],
        minlength: [5, "A course name must have more or equal 5 characters"],
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
    idTeacher: {
        type: String,
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
    lectures: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lecture",
        },
    ]
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
