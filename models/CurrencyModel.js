const mongoose = require('mongoose');

const CurrencySchema = new mongoose.Schema({
    guildId: String,
    userId: String,
    coinsInWallet: Number,
    coinsInBank: Number,
    bankSpace: Number
});

module.exports = mongoose.model('currency', CurrencySchema);