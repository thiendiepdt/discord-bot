const CommandType = require('./CommandType');

class Command {
	constructor() {
		/**
		 * Mảng các tham số được truyền vào.
		 * @type {Array<string>}
		 */
		this.args = [];
		/**
		 * Prefix của command
		 * @type {string}
		 * @example "boss!", "char"
		 */
		this.prefix = '';
		/**
		 * Object message truyền vào từ sự kiện message
		 * @type {Message | PartialMessage}
		 */
		this.message = null;
		/**
		 * Loại command
		 * @type {string}
		 * @example
		 * "NO_ARG" | "ONE_ARG" | "ARGS"
		 */
		this.type = CommandType.NO_ARG;
	}

	/**
	 * Chạy command khi có event message
	 * @param message
	 */
	run(message) {
		this.message = message;
		this.parseCommand();
		if (this.valid()) {
			this.execute();
		}
	}

	/**
	 * Phân tích command
	 */
	parseCommand() {
		switch (this.type) {
		case CommandType.NO_ARG:
			this.args = [];
			break;
		case CommandType.ONE_ARG:
			if (this.isPrefixWithArgument()) {
				this.args = [this.message.content.slice(`${this.prefix} `.length)];
			}
			break;
		case CommandType.ARGS:
			if (this.isPrefixWithArgument()) {
				this.args = this.message.content.slice(`${this.prefix} `.length).split(' ');
			}
			break;
		}
	}

	/**
	 * Check command hợp lệ
	 * @returns {boolean|*}
	 */
	valid() {
		switch (this.type) {
		case CommandType.NO_ARG:
			return this.isPrefix();
		case CommandType.ONE_ARG:
			return this.isPrefixWithArgument();
		case CommandType.ARGS:
			return this.isPrefixWithArgument();
		}
	}

	/**
	 * Run command
	 */
	execute() {
		console.log(this.message.content);
	}

	/**
	 * Command không tham số
	 * @returns {boolean}
	 */
	isPrefix() {
		return this.message.content === this.prefix;
	}

	/**
	 * Command có tham số
	 * @returns {boolean}
	 */
	isPrefixWithArgument() {
		return this.message.content.startsWith(`${this.prefix} `);
	}
}

module.exports = Command;
