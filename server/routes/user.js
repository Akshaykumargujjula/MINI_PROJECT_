const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middleware/auth');
const User = require('../models/User');

// Get user profile
router.get('/profile', authenticateJWT, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user profile' });
    }
});

// Update favorite currency pairs
router.put('/favorites', authenticateJWT, async (req, res) => {
    try {
        const { favoritePairs } = req.body;
        
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { favoritePairs },
            { new: true }
        ).select('-password');

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error updating favorite pairs' });
    }
});

module.exports = router;
