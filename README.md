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
Generates a leaderboard. See examples below.