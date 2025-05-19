const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

// Validation middleware
const validateSignup = [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/\d/)
        .withMessage('Password must contain a number'),
    body('fullName')
        .trim()
        .isLength({ min: 2 })
        .withMessage('Full name must be at least 2 characters long')
];

// Login validation middleware
const validateLogin = [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .normalizeEmail(),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
];

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', validateSignup, async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password, fullName } = req.body;

        // Check if user already exists
        let user = await User.findByEmail(email);
        if (user) {
            return res.status(400).json({
                error: 'User already exists'
            });
        }

        // Create new user
        user = new User({
            email,
            password, // Password will be hashed by the pre-save middleware
            fullName
        });

        // Save user to database
        await user.save();

        // Generate JWT token
        const payload = {
            user: {
                id: user._id,
                email: user.email,
                fullName: user.fullName
            }
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Return success response with token
        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                email: user.email,
                fullName: user.fullName
            }
        });

    } catch (error) {
        console.error('Error in user signup:', error);
        res.status(500).json({
            error: 'Server error'
        });
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', validateLogin, async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(400).json({
                error: 'Invalid credentials'
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({
                error: 'Invalid credentials'
            });
        }

        // Create JWT payload
        const payload = {
            user: {
                id: user._id,
                email: user.email,
                fullName: user.fullName
            }
        };

        // Generate JWT token
        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Return token and user info
        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                fullName: user.fullName
            }
        });

    } catch (error) {
        console.error('Error in user login:', error);
        res.status(500).json({
            error: 'Server error'
        });
    }
});

module.exports = router; 