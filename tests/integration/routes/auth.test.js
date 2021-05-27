const request = require('supertest');
const config = require('config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../../../models/user');

describe('/api/auth', () => {
    let server;
    let user;
    let login;

    beforeEach(async () => {
        server = await require('../../../index');

        login = {
            email: 'user@domain.com',
            password: 'abcdeF1$'
        };

        user = new User({
            name: 'user',
            email: login.email,
            password: await bcrypt.hash(login.password, 10),
            isAdmin: false
        });

        await user.save();
    });

    afterEach(async () => {
        await User.deleteMany();
        await server.close();
    });

    describe('POST /', () => {
        const exec = () => {
            return request(server)
                .post('/api/auth')
                .send(login);
        };

        it('should return 400 if input is invalid', async () => {
            delete login.email;

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if email is not found', async () => {
            login.email = 'not found';

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if password is incorrect', async () => {
            login.password = 'wrong password';

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return a valid token if input is valid', async () => {
            const res = await exec();

            const decoded = jwt.verify(res.text, config.get('jwtPrivateKey'));

            expect(decoded).toHaveProperty('_id');
            expect(decoded).toHaveProperty('isAdmin', false);
        });
    });
});
