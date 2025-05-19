const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    avatarUrl: {
        type: String,
        default: null
    },
    statistics: {
        eventsAttended: {
            type: Number,
            default: 0
        },
        upcomingEvents: {
            type: Number,
            default: 0
        },
        favoriteClubs: {
            type: Number,
            default: 0
        }
    },
    settings: {
        emailNotifications: {
            type: Boolean,
            default: true
        },
        pushNotifications: {
            type: Boolean,
            default: true
        },
        themePreference: {
            type: String,
            enum: ['light', 'dark'],
            default: 'dark'
        }
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Virtual for tickets
userSchema.virtual('tickets', {
    ref: 'Ticket',
    localField: '_id',
    foreignField: 'userId'
});

// Virtual for favorites
userSchema.virtual('favorites', {
    ref: 'Club',
    localField: '_id',
    foreignField: 'favoritedBy'
});

// Virtual for activity log
userSchema.virtual('activityLog', {
    ref: 'ActivityLog',
    localField: '_id',
    foreignField: 'userId'
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Method to update profile
userSchema.methods.updateProfile = async function(updates) {
    Object.assign(this, updates);
    return this.save();
};

// Method to update settings
userSchema.methods.updateSettings = async function(settings) {
    this.settings = { ...this.settings, ...settings };
    return this.save();
};

// Method to update statistics
userSchema.methods.updateStatistics = async function(stats) {
    this.statistics = { ...this.statistics, ...stats };
    return this.save();
};

// Static method to find by email
userSchema.statics.findByEmail = function(email) {
    return this.findOne({ email });
};

const User = mongoose.model('User', userSchema);

module.exports = User; 