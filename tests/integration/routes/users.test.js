const request = require('supertest');
const bcrypt = require('bcrypt');
const test = require('../../../testSetup');
const app = require('../../../startup/app');
const { User } = require('../../../models/user');

describe('/api/users', () => {
    let userObject;
    let token;

    test.setup('users');

    beforeEach(() => {
        userObject = {
            name: "User Name",
            email: "userEmail@domain.com",
            password: "abcdeF1$"
        };
    });

    afterEach(async () => {
        await User.deleteMany();
    });

    describe('GET /', () => {
        let user;
        let adminUser;

        beforeEach(async () => {
            user = await User.create(userObject);
            adminUser = await new User({
                name: 'Admin Name',
                email: 'adminEmail@domain.com',
                password: 'abcdeF1$',
                isAdmin: true
            }).save();
            token = adminUser.generateAuthToken();
        });

        const getUsers = (req) => {
            return request(app)
                .get('/api/users')
                .set('x-auth-token', req.token);
        };

        it('should return 401 if client is not logged in', async () => {
            await test.tokenEmpty(getUsers);
        });

        it('should return 400 if token is invalid', async () => {
            await test.tokenInvalid(getUsers);
        });

        it('should return 403 if user is not an admin', async () => {
            token = user.generateAuthToken();

            await test.adminFalse(getUsers, token);
        });

        it('should return all users if request is valid', async () => {
            const res = await getUsers({ token });

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(u =>
                u.name === userObject.name &&
                u.email === userObject.email &&
                u.password === undefined &&
                u.isAdmin === false
            )).toBe(true);
            expect(res.body.some(u =>
                u.name === adminUser.name &&
                u.email === adminUser.email &&
                u.password === undefined &&
                u.isAdmin === adminUser.isAdmin
            )).toBe(true);
        });
    });

    describe('GET /me', () => {
        let user;

        beforeEach(async () => {
            user = await new User(userObject).save();
            token = user.generateAuthToken();
        });

        const getUser = (req) => {
            return request(app)
                .get('/api/users/me')
                .set('x-auth-token', req.token);
        };

        it('should return 401 if client is not logged in', async () => {
            await test.tokenEmpty(getUser);
        });

        it('should return 400 if token is invalid', async () => {
            await test.tokenInvalid(getUser);
        });

        it('should return 400 if user is not found', async () => {
            await User.deleteMany();

            const res = await getUser({ token });

            expect(res.status).toBe(400);
            expect(res.text).toMatch(/[Nn]ot.*[Ff]ound/);
        });

        it('should return the user if request is valid', async () => {
            const res = await getUser({ token });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', user.name);
            expect(res.body).toHaveProperty('email', user.email);
        });
    });

    describe('POST /', () => {
        const postUser = (req) => {
            if (!req)
                req = { body: userObject };
            return request(app)
                .post('/api/users')
                .send(req.body);
        };

        it('should return 400 if request body is invalid', async () => {
            await test.requestInvalid(postUser, userObject);
        });

        it('should return 400 if email is already in use', async () => {
            await User.create(userObject);

            const res = await postUser();

            expect(res.status).toBe(400);
            expect(res.text).toMatch(/[Ee]mail.*[Aa]lready/);
        });

        it('should save the user with hash if request is valid', async () => {
            await postUser();

            const userInDB = await User.findOne({ email: userObject.email });

            const isEqual = await bcrypt.compare(userObject.password, userInDB.password);

            expect(isEqual).toBe(true);
        });

        it('should add token to header if request is valid', async () => {
            const res = await postUser();

            expect(res.header).toHaveProperty('x-auth-token');
        });

        it('should return _id, name, and email if request is valid', async () => {
            const res = await postUser();

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', userObject.name);
            expect(res.body).toHaveProperty('email', userObject.email);
        });
    });
});
