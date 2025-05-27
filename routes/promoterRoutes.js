const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        // Accept images only
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
});

// @route   GET /api/promoter/events
// @desc    Get all events for the promoter (will add authentication later)
router.get('/events', async (req, res) => {
    try {
        // In a real app, filter by promoter ID: const events = await Event.find({ promoter: req.user.id });
        const events = await Event.find({}); // For now, fetch all events
        res.json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/promoter/events/:id
// @desc    Get a single event by ID for the promoter (will add authentication later)
router.get('/events/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        // In a real app, check if event belongs to promoter: if (event.promoter.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
        res.json(event);
    } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/promoter/events
// @desc    Create a new event (will add authentication later)
router.post('/events', upload.single('image'), async (req, res) => {
    try {
        const eventData = {
            ...req.body,
            ticketTypes: JSON.parse(req.body.ticketTypes),
            imageUrl: req.file ? req.file.filename : null,
            // In a real app, add promoter ID: promoter: req.user.id,
        };
        
        const newEvent = new Event(eventData);
        const event = await newEvent.save();
        res.status(201).json(event);
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(400).json({ message: error.message });
    }
});

// @route   PUT /api/promoter/events/:id
// @desc    Update an event (will add authentication later)
router.put('/events/:id', async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        // In a real app, check if event belongs to promoter before saving: if (event.promoter.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
        res.json(event);
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(400).json({ message: error.message });
    }
});

// @route   DELETE /api/promoter/events/:id
// @desc    Delete an event (will add authentication later)
router.delete('/events/:id', async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        // In a real app, check if event belongs to promoter before deleting
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 