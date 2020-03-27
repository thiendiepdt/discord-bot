const AppProvider = require('../../providers/AppProvider');
const CoronaInfoCommand = require('./CoronaInfoCommand');
const CoronaMapCommand = require('./CoronaMapCommand');

class CoronaProvider extends AppProvider {
	/**
	 * Register commands,..
	 */
	constructor() {
		super();
		this.commands = [
			new CoronaInfoCommand(),
			new CoronaMapCommand(),
		];
	}

	/**
	 * Hàm này sẽ được gọi sau khi tất cả Provider được khởi tạo.
	 */
	boot() {
		super.boot();
	}
}

module.exports = CoronaProvider;
