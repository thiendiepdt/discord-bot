const client = require('../../client/DiscordClient');
const AppProvider = require('../../providers/AppProvider');
const BdoSearchCharacterCommand = require('./BdoSearchCharacterCommand');
const BdoBossTimerCommand = require('./BdoBossTimerCommand');

class BdoProvider extends AppProvider {
	/**
	 * Register commands,..
	 */
	constructor() {
		super();
		this.commands = [
			new BdoSearchCharacterCommand(),
			new BdoBossTimerCommand(),
		];
	}

	/**
	 * Hàm này sẽ được gọi sau khi tất cả Provider được khởi tạo.
	 */
	boot() {
		super.boot();
	}
}

module.exports = BdoProvider;
