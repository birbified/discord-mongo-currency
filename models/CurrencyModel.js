const mongoose = require('mongoose');

const CurrencySchema = new mongoose.Schema({
	guildId: { type: String, required: false },
	userId: { type: String, required: true },
	nuggets: { type: Number, default: 0 },
	fridge: { type: Number, default: 0 },
	bankSpace: { type: Number, default: 2000 },
	inventory: [
		{ type: Object, default: {} },
	],
	badges: { type: Array, default: [] },
	netValue: { type: Number, default: null },
});

module.exports = mongoose.model('currency', CurrencySchema);