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
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        require: true
    }
});

// Static method to get avg of course tuition
CourseSchema.statics.getAverageCost = async function(bootcampId) {
    const obj =  await this.aggregate([
        {
            $match: { bootcamp: bootcampId}
        },
        {
            $group: {
                _id: '$bootcamp',
                averageCost: { $avg: '$tuition' }
            }
        }
    ]);

    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageCost: Math.ceil(obj[0].averageCost / 10) * 10
        });
    } catch(err) {
        console.error(err);
    }
}

// Call getAverageCost after save
CourseSchema.post('save', function() {
    this.constructor.getAverageCost(this.bootcamp);
});

console.log(this);
console.log(this.constructor);


// Call getAverageCost before remove
CourseSchema.pre('deleteOne', { document: false, query: true }, async function() {
    const doc = await this.model.findOne(this.getQuery());
    if (doc) {
        await doc.constructor.getAverageCost(doc.bootcamp);
    }
});



module.exports = mongoose.model('Course', CourseSchema);

