const mongoose = require('mongoose');
const logger = require('../startup/logging');

const uri = 'mongodb://127.0.0.1:27017/adaptivfit?replicaSet=rs0';
module.exports = async function () {
  await mongoose
    .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => logger.info('connected to server'));
};
