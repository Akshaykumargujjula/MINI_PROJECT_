const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');
const { authenticateLocal, authenticateGoogle } = require('../middleware/auth');

// Local Register
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        const user = await User.create({
            username,
            email,
            password,
        });

        // Generate JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user' });
    }
});

// Local Login
router.post('/login', authenticateLocal, (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });

    res.json({
        token,
        user: {
            id: req.user._id,
            username: req.user.username,
            email: req.user.email,
        },
    });
});

// Google OAuth Routes
router.get('/google', authenticateGoogle);

router.get('/google/callback', authenticateGoogle, (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });

    // Redirect to frontend with token
    res.redirect(`${process.env.CLIENT_URL}?token=${token}`);
});

module.exports = router;
