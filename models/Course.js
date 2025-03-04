const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title: {
        type:String,
        trim: true,
        require: [true, 'Please add a course title']
    },
    description: {
        type: String,
        require: [true, 'Please add a description']
    },
    weeks: {
        type:String,
        require: [true, 'Please add number of weeks']
    },
    tuition: {
        type: Number,
        require: [true, 'Please add a tuition cost']
    },
    minimumSkill: {
        type: String,
        require: [true, 'Please add a minimum skill'],
        enum: ['beginner', 'intermediate', 'advanced']
    },
    scholarshipAvailable: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        require: true
    }
});

module.exports = mongoose.model('Course', CourseSchema);

