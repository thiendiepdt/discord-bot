class ProcessHelper {
	static exit(e) {
		if (e) {
			console.log(e);
		}
		process.exit(1);
	}
}

module.exports = ProcessHelper;
