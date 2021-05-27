const request = require('supertest');
const bcrypt = require('bcrypt');
const { User } = require('../../../models/user');

describe('/api/users', () => {
    let server;
    let user;
    let token;

    beforeEach(async () => { server = await require('../../../index'); });

    afterEach(async () => {
        await User.deleteMany();
        await server.close();
    });

    describe('GET /', () => {
        beforeEach(async () => {
            await User.create({
                name: "user",
                email: "user@domain.com",
                password: "abcdeF1$",
                isAdmin: false
            });

            const adminUser = new User({
                name: 'admin',
                email: 'admin@domain.com',
                password: 'abcdeF1$',
                isAdmin: true
            });
            await adminUser.save();

            token = adminUser.generateAuthToken();
        });

        const exec = () => {
            return request(server)
                .get('/api/users')
                .set('x-auth-token', token);
        };

        it('should return 401 if user not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 400 if invalid token provided', async () => {
            token = 'invalid token';

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 403 if user is not an admin', async () => {
            token = new User({ isAdmin: false }).generateAuthToken();

            const res = await exec();

            expect(res.status).toBe(403);
        });

        it('should return list of all users if user is an admin', async () => {
            const res = await exec();

            expect(res.body.length).toBe(2);
            expect(res.body.some(u => u.name === 'user')).toBeTruthy();
            expect(res.body.some(u => u.name === 'admin')).toBeTruthy();
        });
    });

    describe('GET /me', () => {
        beforeEach(async () => {
            user = new User({
                name: 'user',
                email: 'user@domain.com',
                password: 'abcdeF1$',
                isAdmin: false
            });
            await user.save();

            token = user.generateAuthToken();
        });

        const exec = () => {
            return request(server)
                .get('/api/users/me')
                .set('x-auth-token', token);
        };

        it('should return 401 if user not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 400 if invalid token provided', async () => {
            token = 'invalid token';

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if user not found', async () => {
            await User.deleteMany();

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return the user if it is found', async () => {
            const res = await exec();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', user.name);
        });
    });

    describe('POST /', () => {
        beforeEach(async () => {
            user = {
                name: 'user',
                email: 'user@domain.com',
                password: 'abcdeF1$'
            };
        });

        const exec = () => {
            return request(server)
                .post('/api/users')
                .send(user);
        };

        it('should return 400 if input is invalid', async () => {
            delete user.email;

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if email has already been used', async () => {
            await User.create({
                name: 'user1',
                email: 'user@domain.com',
                password: 'abcdeF1$'
            });

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should save the user with hashed password if input is valid', async () => {
            await exec();

            const userInDB = await User.findOne({ email: user.email });

            const isEqual = await bcrypt.compare(user.password, userInDB.password);

            expect(isEqual).toBe(true);
        });

        it('should add token to header if input is valid', async () => {
            const res = await exec();

            expect(res.header).toHaveProperty('x-auth-token');
        });

        it('should return _id, name, and email if input is valid', async () => {
            const res = await exec();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', user.name);
            expect(res.body).toHaveProperty('email', user.email);
        });
    });
});
