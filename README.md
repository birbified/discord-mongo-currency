[![NPM](https://nodei.co/npm/discord-mongo-currency.png)](https://www.npmjs.com/package/discord-mongo-currency/)

# discord-mongo-currency
A npm package for making economy bots.

# Installation
```npm i discord-mongo-currency```

# Starting
Start off by connecting discord-mongo-currency to MongoDB.
```js
const mongoCurrency = require('discord-mongo-currency');

mongoCurrency.connect('some connection string');
```

# All Methods
##### createUser(userId, guildId)
Adds a user to the database.

##### deleteUser(userId, guildId)
Deletes a user from the database.

##### giveCoins(userId, guildId, amount)
Gives coins to a user. Adds the user to the database if the user is saved to the database.

##### deductCoins(userId, guildId, amount)
Deducts coins from a user.

##### findUser(userId, guildId)
Finds the user in the database.

##### giveBankSpace(userId, guildId, amount)
Gives bank space to a user.

##### deposit(userId, guildId, amount)
Deposits coins from the users wallet. Still not finished completely.

##### generateLeaderboard(guildId, amount)
Generates a leaderboard. See examples for an example on how to use.

# Command Examples
##### Balance Command
```js
    const mongoCurrency = require('discord-mongo-currency');
    const { MessageEmbed } = require('discord.js');

    const member = message.mentions.members.first() || message.member;

    const user = await mongoCurrency.findUser(member.id, message.guild.id); // Get the user from the database.

    const embed = new MessageEmbed()
    .setTitle(`${member.user.username}'s Balance`)
    .setDescription(`Wallet: ${user.coinsInWallet}
    Bank: ${user.coinsInBank}/${user.bankSpace}
    Total: ${user.coinsInBank + user.coinsInWallet}`);
    
    message.channel.send(embed);
```

##### Beg Command
```js
    const mongoCurrency = require('discord-mongo-currency');

    const randomCoins = Math.floor(Math.random() * 99) + 1; // Random amount of coins.
    
    await mongoCurrency.giveCoins(message.member.id, message.guild.id, randomCoins);
```

##### Leaderboard Command
```js
    const mongoCurrency = require('discord-mongo-currency');
    const { MessageEmbed } = require('discord.js');
    
    const leaderboard = await mongoCurrency.generateLeaderboard(message.guild.id, 10);
    
    if (leaderboard.length < 1) return message.channel.send("Nobody's on the leaderboard.");
    
    const mappedLeaderboard = leaderboard.map(i => `${client.users.cache.get(i.userId).tag ? client.users.cache.get(u.userId).tag : "Nobody"} - ${i.coinsInWallet}`);
    
    const embed = new MessageEmbed()
    .setTitle(`${message.guild.name}\'s Leaderboard`)
    .setDescription(`${mappedLeaderboard.join('\n')}`);
    
    message.channel.send(embed);
```
