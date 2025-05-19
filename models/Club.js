const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['music', 'dance', 'special', 'holiday']
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviews: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        }
    }],
    favoritedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    events: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }],
    contactInfo: {
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        website: {
            type: String
        }
    },
    operatingHours: {
        monday: { open: String, close: String },
        tuesday: { open: String, close: String },
        wednesday: { open: String, close: String },
        thursday: { open: String, close: String },
        friday: { open: String, close: String },
        saturday: { open: String, close: String },
        sunday: { open: String, close: String }
    },
    amenities: [{
        type: String
    }]
}, {
    timestamps: true
});

// Virtual for review count
clubSchema.virtual('reviewCount').get(function() {
    return this.reviews.length;
});

// Method to add review
clubSchema.methods.addReview = async function(userId, rating, comment) {
    this.reviews.push({ userId, rating, comment });
    
    // Update average rating
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.rating = totalRating / this.reviews.length;
    
    return this.save();
};

// Method to toggle favorite
clubSchema.methods.toggleFavorite = async function(userId) {
    const index = this.favoritedBy.indexOf(userId);
    if (index === -1) {
        this.favoritedBy.push(userId);
    } else {
        this.favoritedBy.splice(index, 1);
    }
    return this.save();
};

// Static method to find by category
clubSchema.statics.findByCategory = function(category) {
    return this.find({ category }).sort({ rating: -1 });
};

// Static method to search clubs
clubSchema.statics.search = function(query) {
    return this.find({
        $or: [
            { name: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } },
            { location: { $regex: query, $options: 'i' } }
        ]
    }).sort({ rating: -1 });
};

// Static method to find top rated clubs
clubSchema.statics.findTopRated = function(limit = 10) {
    return this.find()
        .sort({ rating: -1 })
        .limit(limit);
};

const Club = mongoose.model('Club', clubSchema);

module.exports = Club; 