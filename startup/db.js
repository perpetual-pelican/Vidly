const config = require('config');
const mongoose = require('mongoose');
const winston = require('winston');

module.exports = async function() {
    const db = config.get('db');
    await mongoose.connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true });
    winston.info(`Connected to ${db}...`);
};