const express = require('express');
const winston = require('winston');

winston.info = jest.fn();

describe('server', () => {
    let app;
    let server;

    beforeEach(async () => {
        app = express();
        server = await require('../../../startup/server')(app);
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