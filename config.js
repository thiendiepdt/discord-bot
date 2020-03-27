const config = Object.freeze({
	bot: {
		token: process.env.BOT_TOKEN,
	},
	channel: {
		corona: process.env.CHANNEL_CORONA,
	},
	database: {
		host: process.env.DB_HOST,
		name: process.env.DB_NAME,
		user: process.env.DB_USER,
		pass: process.env.DB_PASS,
	},
});

module.exports = config;
