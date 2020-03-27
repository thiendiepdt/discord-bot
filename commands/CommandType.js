class CommandType {
	/**
	 * Command không tham số
	 * @type {string}
	 */
	static NO_ARG = 'NO_ARG';
	/**
	 * Command chỉ có 1 tham số
	 * @type {string}
	 */
	static ONE_ARG = 'ONE_ARG';
	/**
	 * Command có nhiều tham số
	 * @type {string}
	 */
	static ARGS = 'ARGS';
}

module.exports = CommandType;
