const mongoose = require('mongoose');
const winston = require('winston');
const { dbString, dbOptions } = require('./config');

module.exports = async function () {
  await mongoose.connect(dbString, dbOptions);

  winston.info(`Connected to ${dbString}...`);
};
