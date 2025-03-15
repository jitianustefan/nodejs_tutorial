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
        require: [true, 'Please add some text']
    },
    rating: {
        type: Number,
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

// Static method to get avg rating and save
ReviewSchema.statics.getAverageRating = async function(bootcampId) {
    const obj =  await this.aggregate([
        {
            $match: { bootcamp: bootcampId}
        },
        {
            $group: {
                _id: '$bootcamp',
                averageRating: { $avg: '$rating' }
            }
        }
    ]);

    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageRating: obj[0].averageRating
        });
    } catch(err) {
        console.error(err);
    }
}

// Call getAverageCost after save
ReviewSchema.post('save', function() {
    this.constructor.getAverageRating(this.bootcamp);
});

// Call getAverageCost before remove
ReviewSchema.pre('deleteOne', { document: false, query: true }, async function() {
    const doc = await this.model.findOne(this.getQuery());
    if (doc) {
        await doc.constructor.getAverageRating(doc.bootcamp);
    }
});

module.exports = mongoose.model('Review', ReviewSchema);

