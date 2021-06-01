const winston = require('winston');
const startServer = require('../../../startup/server');

winston.info = jest.fn();

describe('server startup', () => {
    let server;

    beforeEach(async () => {
        server = startServer();
    });

    afterEach(async () => {
        await server.close();
    });

    it('should return a listening server', () => {
        expect(server).toHaveProperty('listening', true);
    });

    it('should log the server status', () => {
        expect(winston.info).toHaveBeenCalled();
        expect(winston.info.mock.calls[0][0]).toMatch(/port/);
    });
});
