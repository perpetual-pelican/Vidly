const winston = require('winston');
require('winston-mongodb');
const config = require('config');

winston.configure({ format: winston.format.prettyPrint() });

winston.exceptions.handle(
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'uncaughtExceptions.log' }),
    new winston.transports.MongoDB({
        db: config.get('db'),
        options: { useUnifiedTopology: true }
    })
);

process.on('unhandledRejection', (ex) => { throw ex; });

winston.add(new winston.transports.Console());
winston.add(new winston.transports.File({ filename: 'logfile.log' }));
winston.add(new winston.transports.MongoDB({
    db: config.get('db'),
    options: { useUnifiedTopology: true }
}));