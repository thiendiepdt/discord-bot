const { Client, Collection } = require('discord.js');

class DiscordClient extends Client {
	constructor(config) {
		super(config);

		this.commands = new Collection();

		this.queue = new Map();

		this.config = config;
	}
}

// Create an instance of a Discord client
const client = new DiscordClient();

module.exports = client;
