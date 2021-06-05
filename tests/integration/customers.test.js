const request = require('supertest');
const test = require('../../testSetup');
const app = require('../../startup/app');
const { User } = require('../../models/user');
const { Customer } = require('../../models/customer');

describe('/api/customers', () => {
    let token;
    let customerObject;

    test.setup('customers');

    beforeEach(async () => {
        token = new User({ isAdmin: false }).generateAuthToken();
        customerObject = { name: 'Customer Name', phone: '12345' };
    });

    describe('GET /', () => {
        let customers;

        beforeEach(async () => {
            customers = [
                await Customer.create(customerObject),
                await Customer.create({
                    name: 'Customer Name 2',
                    phone: '12345'
                })
            ];
        });

        const getCustomers = (req) => {
            return request(app)
                .get('/api/customers')
                .set('x-auth-token', req.token);
        };

        it('should return 401 if client is not logged in', async () => {
            await test.tokenEmpty(getCustomers);
        });

        it('should return 400 if token is invalid', async () => {
            await test.tokenInvalid(getCustomers);
        });

        it('should return all customers if client is logged in', async () => {
            const res = await getCustomers({ token });

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            for (const customer of customers) {
                expect(res.body.some(c =>
                    c.name === customer.name && c.phone === customer.phone
                )).toBe(true);
            }
        });
    });

    describe('GET /:id', () => {
        let customer;
        let id;

        beforeEach(async () => {
            customer = await new Customer(customerObject).save();
            id = customer._id;
        });

        const getCustomer = (req) => {
            return request(app)
                .get('/api/customers/' + req.id)
                .set('x-auth-token', req.token);
        };

        it('should return 401 if client is not logged in', async () => {
            await test.tokenEmpty(getCustomer, id);
        });

        it('should return 400 if token is invalid', async () => {
            await test.tokenInvalid(getCustomer, id);
        });

        it('should return 404 if id is invalid', async () => {
            await test.idInvalid(getCustomer, token);
        });

        it('should return 404 if id is not found', async () => {
            await test.idNotFound(getCustomer, token);
        });

        it('should return the customer if request is valid', async () => {
            const res = await getCustomer({ token, id });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', customer.name);
            expect(res.body).toHaveProperty('phone', customer.phone);
        });
    });

    describe('POST /', () => {
        const postCustomer = (req) => {
            if (!req.body)
                req.body = customerObject;
            return request(app)
                .post('/api/customers')
                .set('x-auth-token', req.token)
                .send(req.body);
        };

        it('should return 401 if client is not logged in', async () => {
            await test.tokenEmpty(postCustomer);
        });

        it('should return 400 if token is invalid', async () => {
            await test.tokenInvalid(postCustomer);
        });

        it('should return 400 if request body is invalid', async () => {
            await test.requestInvalid(postCustomer, customerObject, token);
        });

        it('should save the customer if request is valid', async () => {
            await postCustomer({ token });

            const customerInDB = await Customer.findOne(customerObject);

            expect(customerInDB).toHaveProperty('name', customerObject.name);
            expect(customerInDB).toHaveProperty('phone', customerObject.phone);
        });

        it('should return the customer if request is valid', async () => {
            const res = await postCustomer({ token });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', customerObject.name);
            expect(res.body).toHaveProperty('phone', customerObject.phone);
        });
    });

    describe('PUT /:id', () => {
        let customer;
        let id;
        let customerUpdate;

        beforeEach(async () => {
            customer = await new Customer(customerObject).save();
            id = customer._id;
            customerUpdate = { name: 'Updated Customer Name' };
        });

        const putCustomer = (req) => {
            if (!req.body)
                req.body = customerUpdate;
            return request(app)
                .put('/api/customers/' + req.id)
                .set('x-auth-token', req.token)
                .send(req.body);
        };

        it('should return 401 if client is not logged in', async () => {
            await test.tokenEmpty(putCustomer, id);
        });

        it('should return 400 if token is invalid', async () => {
            await test.tokenInvalid(putCustomer, id);
        });

        it('should return 404 if id is invalid', async () => {
            await test.idInvalid(putCustomer, token);
        });

        it('should return 404 if id is not found', async () => {
            await test.idNotFound(putCustomer, token);
        });

        it('should return 400 if request body is empty', async () => {
            await test.requestEmpty(putCustomer, token, id);
        });

        it('should return 400 if request body is invalid', async () => {
            await test.requestInvalid(putCustomer, customerUpdate, token, id);
        });

        it('should update the customer if request is valid', async () => {
            await putCustomer({ token, id });

            const customerInDB = await Customer.findById(id);

            expect(customerInDB).toHaveProperty('name', customerUpdate.name);
            expect(customerInDB).toHaveProperty('phone', customerObject.phone);
        });

        it('should return the updated customer if request is valid', async () => {
            const res = await putCustomer({ token, id });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', customerUpdate.name);
            expect(res.body).toHaveProperty('phone', customerObject.phone);
        });
    });

    describe('DELETE /:id', () => {
        let customer;
        let id;

        beforeEach(async () => {
            token = new User({ isAdmin: true }).generateAuthToken();
            customer = await new Customer(customerObject).save();
            id = customer._id;
        });

        const deleteCustomer = (req) => {
            return request(app)
                .delete('/api/customers/' + req.id)
                .set('x-auth-token', req.token);
        };

        it('should return 401 if client is not logged in', async () => {
            await test.tokenEmpty(deleteCustomer, id);
        });

        it('should return 400 if token is invalid', async () => {
            await test.tokenInvalid(deleteCustomer, id);
        });

        it('should return 403 if user is not an admin', async () => {
            token = new User({ isAdmin: false }).generateAuthToken();

            await test.adminFalse(deleteCustomer, token, id);
        });

        it('should return 404 if id is invalid', async () => {
            await test.idInvalid(deleteCustomer, token);
        });

        it('should return 404 if id is not found', async () => {
            await test.idNotFound(deleteCustomer, token);
        });

        it('should delete the customer if request is valid', async () => {
            await deleteCustomer({ token, id });

            const customerInDB = await Customer.findById(id);

            expect(customerInDB).toBeNull();
        });

        it('should return the customer if request is valid', async () => {
            const res = await deleteCustomer({ token, id });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', customer.name);
            expect(res.body).toHaveProperty('phone', customer.phone);
        });
    });
});
