const mongoose = require('mongoose');
const config = require('../config');

class Connection {
	static async connect() {
		try {
			const conn = await mongoose.connect(`mongodb://${config.database.host}/`, {
				useNewUrlParser: true,
				useUnifiedTopology: true,
				dbName: config.database.name,
				user: config.database.user,
				pass: config.database.pass,
			});
			console.log('Database connection successful');
			return conn;
		} catch (e) {
			console.error(e);
			process.exit(1);
		}
	}
}

module.exports = Connection;
