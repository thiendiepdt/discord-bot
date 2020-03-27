const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CoronaInfoSchema = new Schema({
	total:  String,
	death: String,
	cure:   String,
	date: { type: Date, default: Date.now },
});

module.exports = CoronaInfoSchema;
