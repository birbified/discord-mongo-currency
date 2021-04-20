const mongoose = require('mongoose');
const currencyModel = require('./models/CurrencyModel');
const cache = new Map();

class DiscordCurrency {
    /**
     * @param {String} connection - MongoDB connection string
     */
    
    static connect(connection) {
        if (!connection) throw new Error('No MongoDB connection string was provided.');
        
        mongoose.connect(connection, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }
    
    /**
     * @param {String} userId - Discord user ID
     * @param {String} guildId - Discord guild ID 
     */
    
    static async findUser(userId, guildId) {
        if (!userId) throw new Error('No user ID was provided');
        if (!guildId) throw new Error('No guild ID was provided');
        
        let user = cache.get(`${userId}_${guildId}`);
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
            cache.set(`${userId}_${guildId}`, user);
        }
        
        return user;
    }
    
    /**
     * @param {String} userId - Discord user ID
     * @param {String} guildId - Discord guild ID
     * @param {Number} amount - Amount of coins to give
     */
    
    static async giveCoins(userId, guildId, amount) {
        if (!userId) throw new Error('No user ID was provided');
        if (!guildId) throw new Error('No guild ID was provided');
        if (!amount) throw new Error('No amount was provided');
        if (isNaN(parseInt(amount))) throw new Error('Amount must be a number');
        if (amount < 1) throw new Error('Amount must be greater than zero');
        
        const user = await this.findUser(userId, guildId);
        
        if ((user.coinsInWallet + amount) > user.bankSpace) return;
        
        user.coinsInWallet += parseInt(amount);
        await currencyModel.updateOne({ userId: userId, guildId: guildId }, user);
        cache.set(`${userId}_${guildId}`, user);
        return user;
    }
    
    /**
     * @param {String} userId - Discord user ID
     * @param {String} guildId - Discord guild ID
     * @param {Number} amount - Amount of coins to subtract
     */
    
    static async subtractCoins(userId, guildId, amount) {
        if (!userId) throw new Error('No user ID was provided');
        if (!guildId) throw new Error('No guild ID was provided');
        if (!amount) throw new Error('No amount was provided');
        if (isNaN(parseInt(amount))) throw new Error('Amount must be a number');
        if (amount < 1) throw new Error('Amount must be greater than zero');
        
        const user = await this.findUser(userId, guildId);
        
        if (amount > user.coinsInWallet) user.coinsInWallet = 0;
        else user.coinsInWallet -= parseInt(amount);
        
        await currencyModel.updateOne({ userId: userId, guildId: guildId }, user);
        cache.set(`${userId}_${guildId}`, user);
        return user;
    }
    
    /**
     * @param {String} userId - Discord user ID
     * @param {String} guildId - Discord guild ID
     * @param {Number} amount - Amount of bank space to add
     */
    
    static async giveBankSpace(userId, guildId, amount) {
        if (!userId) throw new Error('No user ID was provided');
        if (!guildId) throw new Error('No guild ID was provided');
        if (!amount) throw new Error('No amount was provided');
        if (isNaN(parseInt(amount))) throw new Error('Amount must be a number');
        if (amount < 1) throw new Error('Amount must be greater than zero');
        
        const user = await this.findUser(userId, guildId);
        
        user.bankSpace += amount;
        await currencyModel.updateOne({ userId: userId, guildId: guildId }, user);
        cache.set(`${userId}_${guildId}`, user);
        return user;
    }
    
    /**
     * @param {String} userId - Discord user ID
     * @param {String} guildId - Discord guild ID
     * @param {Number} amount - Amount of money to deposit
     */
    
    static async deposit(userId, guildId, amount) {
        if (!userId) throw new Error('No user ID was provided');
        if (!guildId) throw new Error('No guild ID was provided');
        if (!amount) throw new Error('No amount was provided');
        if (isNaN(parseInt(amount))) throw new Error('Amount must be a number');
        if (amount < 1) throw new Error('Amount must be greater than zero');
        
        const user = await this.findUser(userId, guildId);
        
        if (amount > user.coinsInWallet) return;
        if ((amount + user.coinsInBank) > user.bankSpace) return;
        
        user.coinsInWallet -= parseInt(amount);
        user.coinsInBank += parseInt(amount);
        await currencyModel.updateOne({ userId: userId, guildId: guildId }, user);
        cache.set(`${userId}_${guildId}`, user);
        return user;
    }
    
    /**
     * @param {String} userId - Discord user ID
     * @param {String} guildId - Discord guild ID
     * @param {Number} amount - Amount of money to withdraw
     */
    
    static async withdraw(userId, guildId, amount) {
        if (!userId) throw new Error('No user ID was provided');
        if (!guildId) throw new Error('No guild ID was provided');
        if (!amount) throw new Error('No amount was provided');
        if (isNaN(parseInt(amount))) throw new Error('Amount must be a number');
        if (amount < 1) throw new Error('Amount must be greater than zero');
        
        const user = await this.findUser(userId, guildId);
        
        if (amount > user.coinsInBank) return;
        
        user.coinsInWallet += parseInt(amount);
        user.coinsInBank -= parseInt(amount);
        await currencyModel.updateOne({ userId: userId, guildId: guildId }, user);
        cache.set(`${userId}_${guildId}`, user);
        return user;
    }
}

module.exports = DiscordCurrency;
