const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    title: {
        type:String,
        trim: true,
        require: [true, 'Please add a title for the review'],
        maxlength: 100
    },
    text: {
        type: String,
        require: [true, 'Please add a some text']
    },
    rating: {
        type: String,
        require: [true, 'Please add a rating betweeen 1 and 10'],
        min: 1,
        max: 10
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        require: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        require: true
    }
});

// Prevent user from submitting more than one review per bootcamp
ReviewSchema.index({ bootcamp: 1, user: 1}, { unique: true});

module.exports = mongoose.model('Review', ReviewSchema);

