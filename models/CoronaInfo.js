const mongoose = require('mongoose');
const CoronaInfoSchema = require('../migrations/CoronaInfoSchema');

const CoronaInfo = mongoose.model('corona_info', CoronaInfoSchema);

module.exports = CoronaInfo;
