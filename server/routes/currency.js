const express = require('express');
const router = express.Router();
const axios = require('axios');
const { authenticateJWT } = require('../middleware/auth');
const ConversionHistory = require('../models/ConversionHistory');

// Get current exchange rate
router.get('/rate/:base/:target', async (req, res) => {
    try {
        const { base, target } = req.params;
        const response = await axios.get(
            `https://api.exchangerate.host/convert?from=${base}&to=${target}`
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching exchange rate' });
    }
});

// Get historical rates
router.get('/historical/:base/:target', async (req, res) => {
    try {
        const { base, target } = req.params;
        const { start_date, end_date } = req.query;
        
        const response = await axios.get(
            `https://api.exchangerate.host/timeseries?base=${base}&symbols=${target}&start_date=${start_date}&end_date=${end_date}`
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching historical rates' });
    }
});

// Save conversion history (protected route)
router.post('/history', authenticateJWT, async (req, res) => {
    try {
        const { amount, baseCurrency, targetCurrency, rate, provider, fees } = req.body;
        
        const history = await ConversionHistory.create({
            userId: req.user._id,
            amount,
            baseCurrency,
            targetCurrency,
            rate,
            provider,
            fees,
        });

        res.json(history);
    } catch (error) {
        res.status(500).json({ message: 'Error saving conversion history' });
    }
});

// Get user's conversion history (protected route)
router.get('/history', authenticateJWT, async (req, res) => {
    try {
        const history = await ConversionHistory.find({ userId: req.user._id })
            .sort({ timestamp: -1 });
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching conversion history' });
    }
});

module.exports = router;
