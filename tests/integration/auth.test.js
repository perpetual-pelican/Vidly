const request = require('supertest');
const config = require('config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const test = require('../../testSetup');
const app = require('../../startup/app');
const { User } = require('../../models/user');

describe('/api/auth', () => {
    let user;
    let login;

    test.setup('auth');

    beforeEach(async () => {
        login = {
            email: 'userEmail@domain.com',
            password: 'abcdeF1$'
        };
        user = await new User({
            name: 'User Name',
            email: login.email,
            password: await bcrypt.hash(login.password, 10),
            isAdmin: false
        }).save();
    });

    describe('POST /', () => {
        const post = (req) => {
            if (!req)
                req = { body: login };
            return request(app)
                .post('/api/auth')
                .send(req.body);
        };

        it('should return 400 if request body is invalid', async () => {
            await test.requestInvalid(post, login);
        });

        it('should return 400 if email is not found', async () => {
            login.email = 'not found';

            const res = await post();

            expect(res.status).toBe(400);
            expect(res.text).toMatch(/email.*password/);
        });

        it('should return 400 if password is incorrect', async () => {
            login.password = 'incorrect';

            const res = await post();

            expect(res.status).toBe(400);
            expect(res.text).toMatch(/email.*password/);
        });

        it('should return a valid token if request is valid', async () => {
            const res = await post();

            const decoded = jwt.verify(res.text, config.get('jwtPrivateKey'));

            expect(res.status).toBe(200);
            expect(decoded).toHaveProperty('_id');
            expect(decoded).toHaveProperty('isAdmin', user.isAdmin);
        });
    });
});
