const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CoronaInfoSchema = new Schema({
	total: { type: Number, min: 0 },
	death: { type: Number, min: 0 },
	cure: { type: Number, min: 0 },
	date: { type: Date, default: Date.now },
});

module.exports = CoronaInfoSchema;
