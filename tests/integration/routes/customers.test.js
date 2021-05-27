const request = require('supertest');
const mongoose = require('mongoose');
const { User } = require('../../../models/user');
const { Customer } = require('../../../models/customer');

describe('/api/customers', () => {
    let server;
    let token;

    beforeEach(async () => {
        server = await require('../../../index');
        token = new User().generateAuthToken();
    });

    afterEach(async () => {
        await Customer.deleteMany();
        await server.close();
    });

    describe('GET /', () => {
        beforeEach(async () => {
            await Customer.insertMany([
                { name: 'customer1', phone: 'phone' },
                { name: 'customer2', phone: 'phone' }
            ]);
        });

        const exec = () => {
            return request(server)
                .get('/api/customers')
                .set('x-auth-token', token);
        };

        it('should return 401 if client is not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 400 if token is invalid', async () => {
            token = 'invalid';

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return customer list if client is logged in', async () => {
            const res = await exec();

            expect(res.body.some(c => c.name === 'customer1')).toBe(true);
            expect(res.body.some(c => c.name === 'customer2')).toBe(true);
        });
    });

    describe('GET /:id', () => {
        let customer;
        let id;

        beforeEach(async () => {
            customer = new Customer({ name: 'customer', phone: 'phone' });
            await customer.save();

            id = customer._id;
        });

        const exec = () => {
            return request(server)
                .get('/api/customers/' + id)
                .set('x-auth-token', token);
        };

        it('should return 401 if client is not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 400 if token is invalid', async () => {
            token = 'invalid';

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 404 if id is invalid', async () => {
            id = 'invalid';

            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 404 if id not found', async () => {
            id = mongoose.Types.ObjectId().toHexString();

            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return the customer if client is logged in', async () => {
            const res = await exec();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', customer.name);
        });
    });

    describe('POST /', () => {
        let customer;

        beforeEach(() => {
            customer = { name: 'customer', phone: 'phone' };
        });

        const exec = () => {
            return request(server)
                .post('/api/customers')
                .set('x-auth-token', token)
                .send(customer);
        };

        it('should return 401 if client is not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 400 if token is invalid', async () => {
            token = 'invalid';

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if input is invalid', async () => {
            delete customer.name;

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should save the customer if input is valid', async () => {
            await exec();

            const customerInDB = await Customer.findOne({ name: customer.name });

            expect(customerInDB).toHaveProperty('_id');
            expect(customerInDB).toHaveProperty('name', customer.name);
        });

        it('should return the customer if input is valid', async () => {
            const res = await exec();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', customer.name);
        });
    });

    describe('PUT /', () => {
        let customer;
        let id;
        let updatedCustomer;

        beforeEach(async () => {
            customer = new Customer({ name: 'customer', phone: 'phone' });
            await customer.save();

            id = customer._id;

            updatedCustomer = { name: 'new_name' };
        });

        const exec = () => {
            return request(server)
                .put('/api/customers/' + id)
                .set('x-auth-token', token)
                .send(updatedCustomer);
        };

        it('should return 401 if client is not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 400 if token is invalid', async () => {
            token = 'invalid';

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 404 if id is invalid', async () => {
            id = 'invalid';

            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 404 if id not found', async () => {
            id = mongoose.Types.ObjectId().toHexString();

            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 400 if request is empty', async () => {
            updatedCustomer = {};

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if input is invalid', async () => {
            updatedCustomer.name = 1;

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should save the customer if input is valid', async () => {
            await exec();

            const customerInDB = await Customer.findById(id);

            expect(customerInDB).toHaveProperty('name', updatedCustomer.name);
        });

        it('should return the customer if input is valid', async () => {
            const res = await exec();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', updatedCustomer.name);
        });
    });

    describe('DELETE /', () => {
        let customer;
        let id;

        beforeEach(async () => {
            token = new User({ isAdmin: true }).generateAuthToken();

            customer = new Customer({ name: 'customer', phone: 'phone' });
            await customer.save();

            id = customer._id;
        });

        const exec = () => {
            return request(server)
                .delete('/api/customers/' + id)
                .set('x-auth-token', token);
        };

        it('should return 401 if client is not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 400 if token is invalid', async () => {
            token = 'invalid';

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 403 if user is not an admin', async () => {
            token = new User({ isAdmin: false }).generateAuthToken();

            const res = await exec();

            expect(res.status).toBe(403);
        });

        it('should return 404 if id is invalid', async () => {
            id = 'invalid';

            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 404 if id not found', async () => {
            id = mongoose.Types.ObjectId().toHexString();

            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should delete the customer if input is valid', async () => {
            await exec();

            const customerInDB = await Customer.findById(id);

            expect(customerInDB).toBeNull();
        });

        it('should return the customer if input is valid', async () => {
            const res = await exec();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', customer.name);
        });
    });
});
