const mongoose = require('mongoose');
const winston = require('winston');
const db = require('./config').db;

module.exports = async function() {
    await mongoose.connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    });
    
    winston.info(`Connected to ${db}...`);
};