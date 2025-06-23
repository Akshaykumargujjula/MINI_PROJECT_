const mongoose = require('mongoose');

const conversionHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    baseCurrency: {
        type: String,
        required: true,
    },
    targetCurrency: {
        type: String,
        required: true,
    },
    rate: {
        type: Number,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    provider: {
        type: String,
        default: 'exchangerate.host',
    },
    fees: {
        type: Map,
        of: Number,
        default: {},
    },
});

module.exports = mongoose.model('ConversionHistory', conversionHistorySchema);
