const AppProvider = require('../../providers/AppProvider');
const GoogleSearchImageCommand = require('./GoogleSearchImageCommand');

class GoogleProvider extends AppProvider {
	/**
	 * Register commands,..
	 */
	constructor() {
		super();
		this.commands = [
			new GoogleSearchImageCommand(),
		];
	}

	/**
	 * Hàm này sẽ được gọi sau khi tất cả Provider được khởi tạo.
	 */
	boot() {
		super.boot();
	}
}

module.exports = GoogleProvider;
