const mongoose = require('mongoose');
const currencyModel = require('./models/CurrencyModel');

class DiscordCurrency {
    /**
     * @param {Object} options - DiscordCurrency options
     */
    
    constructor(options = {}) {
        if (Object.keys(options).length === 0) throw new Error('No options were provided');
        if (!options.url) throw new Error('No MongoDB connection string was provided');
        
        this.options = options;
        this.cache = new Map();
        
        mongoose.connect(options.url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }
    
    /**
     * @param {String} userId - Discord user ID
     * @param {String} guildId - Discord guild ID 
     */
    
    async findUser(userId, guildId) {
        if (!userId) throw new Error('No user ID was provided');
        if (!guildId) throw new Error('No guild ID was provided');
        
        let user = this.cache.get(`${userId}_${guildId}`);
        if (!user) {
            let e = await currencyModel.findOne({ userId: userId, guildId: guildId });
            if (!e) {
                e = await currencyModel.create({
                    userId: userId,
                    guildId: guildId,
                    bankSpace: 1000,
                    coinsInBank: 0,
                    coinsInWallet: 0
                });
            }
            
            user = e;
            this.cache.set(`${userId}_${guildId}`, user);
        }
        
        return user;
    }
    
    /**
     * @param {String} userId - Discord user ID
     * @param {String} guildId - Discord guild ID
     * @param {Number} amount - Amount of coins to give
     */
    
    async giveCoins(userId, guildId, amount) {
        if (!userId) throw new Error('No user ID was provided');
        if (!guildId) throw new Error('No guild ID was provided');
        if (!amount) throw new Error('No amount was provided');
        if (isNaN(parseInt(amount))) throw new Error('Amount must be a number');
        if (amount < 1) throw new Error('Amount must be greater than zero');
        
        const user = await this.findUser(userId, guildId);
        
        if ((user.coinsInWallet + amount) > user.bankSpace) return;
        
        user.coinsInWallet += parseInt(amount);
        await currencyModel.updateOne({ userId: userId, guildId: guildId }, user);
        this.cache.set(`${userId}_${guildId}`, user);
    }
}

module.exports = DiscordCurrency;
