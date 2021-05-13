const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');

module.exports = function() {
    winston.configure({ format: winston.format.prettyPrint() });
    
    winston.exceptions.handle(
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'uncaughtExceptions.log' })
    );

    process.on('unhandledRejection', (ex) => { throw ex; });

    winston.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        )
    }));
    winston.add(new winston.transports.File({ filename: 'logfile.log' }));
    winston.add(new winston.transports.MongoDB({
        db: 'mongodb://localhost/vidly',
        options: { useUnifiedTopology: true }
    }));

    winston.loggers.add('console', {
        format: winston.format.prettyPrint(),
        transports: [new winston.transports.Console()]
    });

    winston.loggers.add('file', {
        format: winston.format.prettyPrint(),
        transports: [new winston.transports.File({ filename: 'logfile.log' })]
    });

    winston.loggers.add('db', {
        transports: [
            new winston.transports.MongoDB({
                db: 'mongodb://localhost/vidly',
                options: { useUnifiedTopology: true }
            })
        ]
    });
};