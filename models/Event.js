const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['music', 'dance', 'special', 'holiday']
    },
    imageUrl: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    capacity: {
        type: Number,
        required: true,
        min: 1
    },
    ticketsSold: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        required: true,
        enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
        default: 'upcoming'
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ticketTypes: [{
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        quantity: {
            type: Number,
            required: true,
            min: 0
        }
    }]
}, {
    timestamps: true
});

// Virtual for available tickets
eventSchema.virtual('availableTickets').get(function() {
    return this.capacity - this.ticketsSold;
});

// Virtual for isSoldOut
eventSchema.virtual('isSoldOut').get(function() {
    return this.ticketsSold >= this.capacity;
});

// Method to check if event is upcoming
eventSchema.methods.isUpcoming = function() {
    return new Date() < this.date;
};

// Method to update ticket sales
eventSchema.methods.updateTicketSales = async function(quantity) {
    if (this.ticketsSold + quantity > this.capacity) {
        throw new Error('Not enough tickets available');
    }
    this.ticketsSold += quantity;
    return this.save();
};

// Static method to find upcoming events
eventSchema.statics.findUpcoming = function() {
    return this.find({
        date: { $gt: new Date() },
        status: 'upcoming'
    }).sort({ date: 1 });
};

// Static method to find events by category
eventSchema.statics.findByCategory = function(category) {
    return this.find({ category }).sort({ date: 1 });
};

// Static method to search events
eventSchema.statics.search = function(query) {
    return this.find({
        $or: [
            { title: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } },
            { location: { $regex: query, $options: 'i' } }
        ]
    }).sort({ date: 1 });
};

const Event = mongoose.model('Event', eventSchema);

module.exports = Event; 