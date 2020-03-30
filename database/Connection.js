const mongoose = require('mongoose');
const config = require('../config');

class Connection {
	static async connect() {
		return await mongoose.connect(`mongodb://${config.database.host}/`, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			dbName: config.database.name,
			user: config.database.user,
			pass: config.database.pass,
		});
	}
}

module.exports = Connection;
