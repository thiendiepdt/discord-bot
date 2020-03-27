// System import
require('dotenv').config();
const Connection = require('./database/Connection');
const config = require('./config');
// Providers
const BdoProvider = require('./components/bdo/BdoProvider');
const CoronaProvider = require('./components/corona/CoronaProvider');
const GoogleProvider = require('./components/google/GoogleProvider');
// Discord import
const client = require('./client/DiscordClient');
// Utils
const CoronaUpdateService = require('./components/corona/CoronaUpdateService');

// Connect to MongoDB
const conn = Connection.connect();
// Register Providers
const providers = {
	BdoProvider,
	CoronaProvider,
	GoogleProvider,
};
for (const name in providers) {
	providers[name] = new providers[name]();
}
// Booting Providers
for (const name in providers) {
	providers[name].boot();
}

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
client.on('ready', async () => {
	console.log('I am ready!');
	const runner = CoronaUpdateService.run();
	client.user.setPresence({
		status: 'online',
		activity: {
			name: 'Dota 4\nRank 100 {8k MMR} | boss!',
			type: 'PLAYING',
		},
	}).catch(() => {
	});

});

client.on('message', async message => {
	for (const name in providers) {
		const provider = providers[name];
		provider.commands.forEach((command) => {
			command.run(message);
		});
	}
});

// Log our bot in using the token from https://discordapp.com/developers/applications/me
client.login(config.bot.token);