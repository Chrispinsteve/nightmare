const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    ticketType: {
        type: String,
        required: true,
        enum: ['regular', 'vip', 'early-bird']
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'confirmed', 'cancelled', 'used'],
        default: 'pending'
    },
    purchaseDate: {
        type: Date,
        default: Date.now
    },
    qrCode: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

// Virtual for total price
ticketSchema.virtual('totalPrice').get(function() {
    return this.price * this.quantity;
});

// Method to validate ticket
ticketSchema.methods.validateTicket = function() {
    return this.status === 'confirmed' && !this.isExpired();
};

// Method to check if ticket is expired
ticketSchema.methods.isExpired = function() {
    // Assuming event date is stored in the Event model
    return this.populate('eventId').then(ticket => {
        return new Date() > ticket.eventId.date;
    });
};

// Static method to find user's tickets
ticketSchema.statics.findUserTickets = function(userId) {
    return this.find({ userId })
        .populate('eventId')
        .sort({ purchaseDate: -1 });
};

// Static method to find event tickets
ticketSchema.statics.findEventTickets = function(eventId) {
    return this.find({ eventId })
        .populate('userId', 'email fullName')
        .sort({ purchaseDate: -1 });
};

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket; 