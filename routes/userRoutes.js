const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// @route   GET /api/users/profile
// @desc    Get user profile data
// @access  Private
router.get('/profile', async (req, res) => {
    try {
        // Get token from header or query parameter
        const token = req.header('x-auth-token') || req.query.token;
        if (!token) {
            return res.status(401).json({ error: 'No token, authorization denied' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.user.id;

        // Get user data
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: error.message || 'Server error' });
    }
});

module.exports = router; 