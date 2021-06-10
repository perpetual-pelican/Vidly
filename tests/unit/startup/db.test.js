const mongoose = require('mongoose');
const winston = require('winston');
const config = require('config');
const connectToDB = require('../../../startup/db');

describe('db startup', () => {
    beforeEach(() => {
        winston.info = jest.fn();
    });

    afterEach(async () => {
        await mongoose.disconnect();
    });
    
    it('should connect to vidly_test mongodb', async () => {
        await connectToDB();
        
        expect(mongoose.connection.db.databaseName).toMatch(/vidly_test/);
    });

    it('should log the connection status to winston', async () => {
        await connectToDB();
        
        expect(winston.info).toHaveBeenCalled();
        expect(winston.info.mock.calls[0][0]).toMatch(config.get('db'));
    });
});
