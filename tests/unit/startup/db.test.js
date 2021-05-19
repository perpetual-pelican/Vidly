const config = require('config');
const mongoose = require('mongoose');
const winston = require('winston');

winston.info = jest.fn();

describe('db', () => {
    it('should connect to vidly_tests mongodb', async () => {
        await require('../../../startup/db')();
        
        expect(mongoose.connection.db.databaseName).toMatch(/vidly_tests/);
    });

    it('should log the connection status to winston', async () => {
        await require('../../../startup/db')();
        
        expect(winston.info).toHaveBeenCalled();
        expect(winston.info.mock.calls[0][0]).toMatch(/vidly_tests/);
    });
});
