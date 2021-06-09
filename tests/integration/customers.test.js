const test = require('../../testSetup');
const app = require('../../startup/app');
const { User } = require('../../models/user');
const { Customer } = require('../../models/customer');

const { getAll, getOne, post, put, del } = test.request;

describe('/api/customers', () => {
    const token = new User({ isAdmin: false }).generateAuthToken();
    let customerObject;
    let req;

    test.setup('customers', app);

    beforeEach(() => {
        customerObject = { name: 'Customer Name', phone: '12345' };
    });

    describe('GET /', () => {
        const find = Customer.find;
        let customers;

        beforeEach(async () => {
            customers = [
                await Customer.create(customerObject),
                await Customer.create({
                    name: 'Customer Name 2',
                    phone: '12345'
                })
            ];
            req = { token, body: customerObject };
        });

        afterEach(() => {
            Customer.find = find;
        });

        it('should return 401 if client is not logged in', async () => {
            await test.tokenEmpty(getAll, req);
        });

        it('should return 400 if token is invalid', async () => {
            await test.tokenInvalid(getAll, req);
        });

        it('should return 500 if an uncaughtException is encountered', async () => {
            Customer.find = jest.fn(() => { throw new Error('fake uncaught exception'); });

            const res = await getAll(req);

            expect(res.status).toBe(500);
            expect(res.text).toMatch(/Something failed/);
        });

        it('should return all customers if client is logged in', async () => {
            const res = await getAll(req);

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

        beforeEach(async () => {
            customer = await new Customer(customerObject).save();
            req = { token, id: customer._id };
        });

        it('should return 401 if client is not logged in', async () => {
            await test.tokenEmpty(getOne, req);
        });

        it('should return 400 if token is invalid', async () => {
            await test.tokenInvalid(getOne, req);
        });

        it('should return 404 if id is invalid', async () => {
            await test.idInvalid(getOne, req);
        });

        it('should return 404 if id is not found', async () => {
            await test.idNotFound(getOne, req);
        });

        it('should return the customer if request is valid', async () => {
            const res = await getOne(req);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', customer.name);
            expect(res.body).toHaveProperty('phone', customer.phone);
        });
    });

    describe('POST /', () => {
        beforeEach(() => {
            req = { token, body: customerObject };
        });

        it('should return 401 if client is not logged in', async () => {
            await test.tokenEmpty(post, req);
        });

        it('should return 400 if token is invalid', async () => {
            await test.tokenInvalid(post, req);
        });

        it('should return 400 if request body is invalid', async () => {
            await test.requestInvalid(post, req);
        });

        it('should save the customer if request is valid', async () => {
            await post(req);

            const customerInDB = await Customer.findOne(customerObject);

            expect(customerInDB).toHaveProperty('name', customerObject.name);
            expect(customerInDB).toHaveProperty('phone', customerObject.phone);
        });

        it('should return the customer if request is valid', async () => {
            const res = await post(req);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', customerObject.name);
            expect(res.body).toHaveProperty('phone', customerObject.phone);
        });
    });

    describe('PUT /:id', () => {
        let customer;
        let customerUpdate;

        beforeEach(async () => {
            customer = await new Customer(customerObject).save();
            customerUpdate = { name: 'Updated Customer Name' };
            req = {
                token,
                id: customer._id,
                body: customerUpdate
            };
        });

        it('should return 401 if client is not logged in', async () => {
            await test.tokenEmpty(put, req);
        });

        it('should return 400 if token is invalid', async () => {
            await test.tokenInvalid(put, req);
        });

        it('should return 404 if id is invalid', async () => {
            await test.idInvalid(put, req);
        });

        it('should return 404 if id is not found', async () => {
            await test.idNotFound(put, req);
        });

        it('should return 400 if request body is empty', async () => {
            await test.requestEmpty(put, req);
        });

        it('should return 400 if request body is invalid', async () => {
            await test.requestInvalid(put, req);
        });

        it('should update the customer if request is valid', async () => {
            await put(req);

            const customerInDB = await Customer.findById(req.id);

            expect(customerInDB).toHaveProperty('name', customerUpdate.name);
            expect(customerInDB).toHaveProperty('phone', customerObject.phone);
        });

        it('should return the updated customer if request is valid', async () => {
            const res = await put(req);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', customerUpdate.name);
            expect(res.body).toHaveProperty('phone', customerObject.phone);
        });
    });

    describe('DELETE /:id', () => {
        let customer;

        beforeEach(async () => {
            customer = await new Customer(customerObject).save();
            req = {
                token: new User({ isAdmin: true }).generateAuthToken(),
                id: customer._id
            };
        });

        it('should return 401 if client is not logged in', async () => {
            await test.tokenEmpty(del, req);
        });

        it('should return 400 if token is invalid', async () => {
            await test.tokenInvalid(del, req);
        });

        it('should return 403 if user is not an admin', async () => {
            req.token = new User({ isAdmin: false }).generateAuthToken();

            await test.adminFalse(del, req);
        });

        it('should return 404 if id is invalid', async () => {
            await test.idInvalid(del, req);
        });

        it('should return 404 if id is not found', async () => {
            await test.idNotFound(del, req);
        });

        it('should delete the customer if request is valid', async () => {
            await del(req);

            const customerInDB = await Customer.findById(req.id);

            expect(customerInDB).toBeNull();
        });

        it('should return the customer if request is valid', async () => {
            const res = await del(req);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', customer.name);
            expect(res.body).toHaveProperty('phone', customer.phone);
        });
    });
});
