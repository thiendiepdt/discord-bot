class AppProvider {
	constructor() {
		/**
		 *
		 * @type {Array<Command>}
		 */
		this.commands = [];
	}

	/**
	 * Hàm này sẽ được gọi sau khi tất cả Provider được khởi tạo.
	 */
	boot() {
		console.log(`Booting ${this.constructor.name}...`);
	};
}

module.exports = AppProvider;
