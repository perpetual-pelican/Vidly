const winston = require('winston');
require('winston-mongodb');
const config = require('config');

const env = process.env.NODE_ENV || 'development';

winston.configure({ format: winston.format.prettyPrint() });

if (env === 'development')
    winston.exceptions.handle(new winston.transports.Console());
winston.exceptions.handle(
    new winston.transports.File({ filename: `logs/${env}/uncaughtExceptions.log` }),
    new winston.transports.MongoDB({
        db: config.get('db'),
        options: { useUnifiedTopology: true }
    })
);

process.on('unhandledRejection', (ex) => { throw ex; });

if (env === 'development')
    winston.add(new winston.transports.Console());
winston.add(new winston.transports.File({ filename: `logs/${env}/info.log` }));
winston.add(new winston.transports.MongoDB({
    db: config.get('db'),
    options: { useUnifiedTopology: true }
}));