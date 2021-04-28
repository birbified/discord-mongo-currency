var connection;
const mongoose = require('mongoose');
const currencyModel = require('./models/CurrencyModel');

mongoose.set('useFindAndModify', false);

class mongoCurrency {

    /**
     * 
     * @param {string} url - A MongoDB connection string.
     */

    static async connect(url) {
        if (!url) throw new TypeError("You didn't provide a MongoDB connection string");

        connection = url;

        return mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }

    /**
     * 
     * @param {string} userId - A valid discord user ID.
     * @param {string} guildId - A valid discord guild ID.
     */

    static async find(userId) {
        if (!userId) throw new TypeError("You didn't provide a user ID.");

        let user = await currencyModel.findOne({ userId: userId });
        if (!user) return false;

        return user;
    }

    /**
     * 
     * @param {string} userId - A discord user ID.
     * @param {string} guildId - A discord guild ID.
     * @param {number} amount - Amount of coins to give.
     */
    
    static async giveCoins(userId, amount) {
        if (!userId) throw new TypeError("You didn't provide a user ID.");
        if (!amount) throw new TypeError("You didn't provide an amount of coins.");
        if (isNaN(amount)) throw new TypeError("The amount must be a number.");
        if (amount < 0) throw new TypeError("New amount must not be under 0.");

        let user = await currencyModel.findOne({ userId: userId });

        if (!user) {
            const newData = new currencyModel({
                userId: userId,
                bankSpace: 1000,
                coinsInBank: 0,
                coinsInWallet: parseInt(amount)
            });

            await newData.save()
            .catch(err => console.log(err));
            
            return amount;
        }

        user.coinsInWallet += parseInt(amount);

        await user.save()
        .catch(err => console.log(err));

        return amount;
    }

    /**
     * 
     * @param {string} userId - A discord user ID.
     * @param {string} guildId - A discord guild ID.
     * @param {string} amount - Amount of coins to deduct.
     */

    static async deductCoins(userId, guildId, amount) {
        if (!userId) throw new TypeError("You didn't provide a user ID.");
        if (!amount) throw new TypeError("You didn't provide an amount of coins.");
        if (isNaN(amount)) throw new TypeError("The amount must be a number.");
        if (amount < 0) throw new TypeError("New amount must not be under 0.");

        let user = await currencyModel.findOne({ userId: userId });

        if (!user) {
            const newData = new currencyModel({
                userId: userId,
                bankSpace: 1000,
                coinsInBank: 0,
                coinsInWallet: 0
            });

            await newData.save()
            .catch(err => console.log(err));
            
            return amount;
        }

        if (amount > user.coinsInWallet) {
            user.coinsInWallet -= user.coinsInWallet;

            await user.save()
            .catch(err => console.log(err));

            return amount;
        }

        user.coinsInWallet -= parseInt(amount);

        await user.save()
        .catch(err => console.log(err));

        return amount;
    }

    /**
     * 
     * @param {string} userId - A discord user ID.
     * @param {string} guildId - A discord guild ID.
     * @param {string} amount - Amount of bank space to give.
     */
    
    static async giveBankSpace(userId, amount) {
        if (!userId) throw new TypeError("You didn't provide a user ID.");
        if (!amount) throw new TypeError("You didn't provide an amount of coins.");
        if (isNaN(amount)) throw new TypeError("The amount must be a number.");
        if (amount < 0) throw new TypeError("New amount must not be under 0.");

        let user = await currencyModel.findOne({ userId: userId });

        if (!user) {
            let newData = new currencyModel({
                userId: userId,
                bankSpace: 1000 + parseInt(amount),
                coinsInBank: 0,
                coinsInWallet: 0
            });

            await newData.save()
            .catch(err => console.log(err));

            return amount;
        }

        user.bankSpace += parseInt(amount);

        await user.save()
        .catch(err => console.log(err));

        return amount;
    }

    /**
     * 
     * @param {string} userId - A discord user ID.
     * @param {string} guildId - A discord guild ID.
     */

    static async createUser(userId) {
        if (!userId) throw new TypeError("Please provide a user ID.");

        let user = await currencyModel.findOne({ userId: userId });
        if (user) return false;

        let newData = new currencyModel({
            userId: userId,
            bankSpace: 1000,
            coinsInBank: 0,
            coinsInWallet: 0
        });

        await newData.save()
        .catch(err => console.log(err));
    }

    /**
     * 
     * @param {string} userId - A discord user ID.
     * @param {string} guildId - A discord guild ID.
     */

    static async deleteUser(userId) {
        if (!userId) throw new TypeError("Please provide a user ID.");

        let user = await currencyModel.findOne({ userId: userId });
        if (!user) return false;

        await currencyModel.findOneAndRemove({ userId: userId });

        await user.save()
        .catch(err => console.log(err));
    }

    /**
     * 
     * @param {string} guildId - A discord guild ID.
     * @param {number} amount - The amount of users to show.
     

    static async generateLeaderboard(guildId, amount) {
        if (!guildId) throw new TypeError("Please provide a guild ID.");
        if (!amount) throw new TypeError("Please provide the amount of users to show.");
        if (isNaN(amount)) throw new TypeError("Amount must be a number");

        let users = await currencyModel.find({ guildId: guildId }).sort([['coinsInWallet', 'descending']]).exec();

        return users.slice(0, amount);
    }*/
}

module.exports = mongoCurrency;
