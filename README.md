[![NPM](https://nodei.co/npm/discord-mongo-currency.png)](https://www.npmjs.com/package/discord-mongo-currency/)

# discord-mongo-currency
A npm package for making economy bots. Automatically caches data.

# Installation
```npm i discord-mongo-currency```

# Starting
Start off by connecting discord-mongo-currency to MongoDB.
```js
    const DiscordCurrency = require('discord-mongo-currency');

    const currency = new DiscordCurrency({
        url: 'your connection string'
    });
    
    client.currency = currency; // for global use
```

# All Methods
##### giveCoins(userId, guildId, amount)
Gives coins to a user. Adds the user to the database if the user is saved to the database.

##### subtractCoins(userId, guildId, amount)
Subtracts coins from a user.

##### findUser(userId, guildId)
Finds the user in the database.

##### giveBankSpace(userId, guildId, amount)
Gives bank space to a user.

##### deposit(userId, guildId, amount)
Deposits coins from the users wallet. ~~Still not finished completely.~~ Done!

##### withdraw(guildId, amount)
Withdraws coins.

# Command Examples
##### Balance Command
```js
    const { MessageEmbed } = require('discord.js');

    const member = message.mentions.members.first() || message.member;
    const user = await bot.currency.findUser(member.id, message.guild.id); // Get the user from the database.

    const embed = new MessageEmbed()
    .setTitle(`${member.user.username}'s Balance`)
    .setDescription(`Wallet: ${user.coinsInWallet}
    Bank: ${user.coinsInBank}/${user.bankSpace}
    Total: ${user.coinsInBank + user.coinsInWallet}`);
    
    message.channel.send(embed);
```

##### Beg Command
```js
    const randomCoins = Math.floor(Math.random() * 99) + 1; // Random amount of coins.
    await mongoCurrency.giveCoins(message.member.id, message.guild.id, randomCoins);
```
