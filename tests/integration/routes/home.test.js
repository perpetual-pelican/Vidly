const request = require('supertest');

describe('/', () => {
    let server;

    beforeEach(async () => { server = await require('../../../index'); });

    afterEach(async () => { await server.close(); });

    it('should return the home page', async () => {
        const res = await request(server).get('/');

        expect(res.status).toBe(200);
        expect(res.text).toMatch(/Home/);
    });
});