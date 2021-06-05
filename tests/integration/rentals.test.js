const request = require('supertest');
const mongoose = require('mongoose');
const _ = require('lodash');
const test = require('../../testSetup');
const app = require('../../startup/app');
const { User } = require('../../models/user');
const { Customer } = require('../../models/customer');
const { Genre } = require('../../models/genre');
const { Movie } = require('../../models/movie');
const { Rental } = require('../../models/rental');

describe('/api/rentals', () => {
    let token;
    let customer;
    let genre;
    let movie;
    let rentalObject;

    test.setup('rentals');

    beforeEach(async () => {
        token = new User({ isAdmin: false }).generateAuthToken();
        customer = await new Customer({
            name: 'Customer Name',
            phone: '12345'
        }).save();
        genre = await new Genre({ name: 'Genre Name' }).save();
        movie = await new Movie({
            title: 'Movie Title',
            dailyRentalRate: 1,
            numberInStock: 1,
            genres: [genre]
        }).save();
        rentalObject = {
            customer: _.pick(customer, ['_id', 'name', 'phone', 'isGold']),
            movie: _.pick(movie, ['_id', 'title', 'dailyRentalRate'])
        };
    });

    describe('GET /', () => {
        let customer2;
        let genre2;
        let movie2;

        beforeEach(async () => {
            customer2 = await new Customer({
                name: 'customer Name 2',
                phone: '12345'
            }).save();
            genre2 = await new Genre({ name: 'Genre Name 2' }).save();
            movie2 = await new Movie({
                title: 'Movie Title 2',
                dailyRentalRate: 2,
                numberInStock: 2,
                genres: [genre2]
            }).save();
            await Rental.insertMany([
                rentalObject,
                {
                    customer: _.pick(customer2, ['_id', 'name', 'phone', 'isGold']),
                    movie: _.pick(movie2, ['_id', 'title', 'dailyRentalRate'])
                }
            ]);
        });

        const getRentals = (req) => {
            return request(app)
                .get('/api/rentals')
                .set('x-auth-token', req.token);
        };

        it('should return 401 if client is not logged in', async () => {
            await test.tokenEmpty(getRentals);
        });

        it('should return 400 if token is invalid', async () => {
            await test.tokenInvalid(getRentals);
        });

        it('should return all rentals if client is logged in', async () => {
            const res = await getRentals({ token });

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(r =>
                r.customer.name === customer.name &&
                r.customer.phone === customer.phone &&
                r.customer.isGold === customer.isGold &&
                r.movie.title === movie.title &&
                r.movie.dailyRentalRate === movie.dailyRentalRate
            )).toBe(true);
            expect(res.body.some(r =>
                r.customer.name === customer2.name &&
                r.customer.phone === customer2.phone &&
                r.customer.isGold === customer2.isGold &&
                r.movie.title === movie2.title &&
                r.movie.dailyRentalRate === movie2.dailyRentalRate
            )).toBe(true);
        });
    });

    describe('GET /:id', () => {
        let rental;
        let id;

        beforeEach(async () => {
            rental = await new Rental(rentalObject).save();
            id = rental._id;
        });

        const getRental = (req) => {
            return request(app)
                .get('/api/rentals/' + req.id)
                .set('x-auth-token', req.token);
        };

        it('should return 401 if client is not logged in', async () => {
            await test.tokenEmpty(getRental, id);
        });

        it('should return 400 if token is invalid', async () => {
            await test.tokenInvalid(getRental, id);
        });

        it('should return 404 if id is invalid', async () => {
            await test.idInvalid(getRental, token);
        });

        it('should return 404 if id is not found', async () => {
            await test.idNotFound(getRental, token);
        });

        it('should return the rental if request is valid', async () => {
            const res = await getRental({ token, id });

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('customer.name', customer.name);
            expect(res.body).toHaveProperty('movie.title', movie.title);
        });
    });

    describe('POST /', () => {
        beforeEach(async () => {
            rentalObject = {
                customerId: customer._id,
                movieId: movie._id
            };
        });

        const postRental = (req) => {
            if (!req.body)
                req.body = rentalObject;
            return request(app)
                .post('/api/rentals')
                .set('x-auth-token', req.token)
                .send(req.body);
        };

        it('should return 401 if client is not logged in', async () => {
            await test.tokenEmpty(postRental);
        });

        it('should return 400 if token is invalid', async () => {
            await test.tokenInvalid(postRental);
        });

        it('should return 400 if request body is invalid', async () => {
            await test.requestInvalid(postRental, rentalObject, token);
        });

        it('should return 400 if customer is not found', async () => {
            rentalObject.customerId = mongoose.Types.ObjectId().toHexString();

            const res = await postRental({ token });

            expect(res.status).toBe(400);
            expect(res.text).toMatch(/[Cc]ustomer/);
        });

        it('should return 400 if movie is not found', async () => {
            rentalObject.movieId = mongoose.Types.ObjectId().toHexString();

            const res = await postRental({ token, });

            expect(res.status).toBe(400);
            expect(res.text).toMatch(/[Mm]ovie/);
        });

        it('should return 400 if movie is out of stock', async () => {
            await Movie.updateOne({ _id: movie._id }, { $set: { numberInStock: 0 } });

            const res = await postRental({ token });

            expect(res.status).toBe(400);
            expect(res.text).toMatch(/[Mm]ovie.*[Ss]tock/);
        });

        it('should save the rental and decrease the movie stock if request is valid', async () => {
            await postRental({ token });

            const rentalInDB = await Rental.findOne({
                'customer._id': customer._id,
                'movie._id': movie._id
            });
            const movieInDB = await Movie.findById(movie._id);

            expect(rentalInDB).toHaveProperty('_id');
            expect(rentalInDB).toHaveProperty('customer._id', customer._id);
            expect(rentalInDB).toHaveProperty('movie._id', movie._id);
            expect(movieInDB.numberInStock).toBe(movie.numberInStock - 1);
        });

        it('should return the rental if request is valid', async () => {
            const res = await postRental({ token });

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('customer._id');
            expect(res.body).toHaveProperty('customer.name', customer.name);
            expect(res.body).toHaveProperty('movie._id');
            expect(res.body).toHaveProperty('movie.title', movie.title);
        });
    });

    describe('DELETE /:id', () => {
        let rental;
        let id;

        beforeEach(async () => {
            token = new User({ isAdmin: true }).generateAuthToken();
            rental = await new Rental(rentalObject).save();
            id = rental._id;
        });

        const deleteRental = (req) => {
            return request(app)
                .delete('/api/rentals/' + req.id)
                .set('x-auth-token', req.token);
        };

        it('should return 401 if client is not logged in', async () => {
            await test.tokenEmpty(deleteRental, id);
        });

        it('should return 400 if token is invalid', async () => {
            await test.tokenInvalid(deleteRental, id);
        });

        it('should return 403 if user is not an admin', async () => {
            token = new User({ isAdmin: false }).generateAuthToken();

            await test.adminFalse(deleteRental, token, id);
        });

        it('should return 404 if id is invalid', async () => {
            await test.idInvalid(deleteRental, token);
        });

        it('should return 404 if id is not found', async () => {
            await test.idNotFound(deleteRental, token);
        });

        it('should delete the rental and increase the movie stock if request is valid', async () => {
            await deleteRental({ token, id });

            const rentalInDB = await Rental.findOne({
                'customer._id': customer._id,
                'movie._id': movie._id
            });

            const movieInDB = await Movie.findById(movie._id);

            expect(rentalInDB).toBeNull();

            expect(movieInDB.numberInStock).toBe(movie.numberInStock + 1);
        });

        it('should return the rental if request is valid', async () => {
            const res = await deleteRental({ token, id });

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('customer._id');
            expect(res.body).toHaveProperty('customer.name', customer.name);
            expect(res.body).toHaveProperty('movie._id');
            expect(res.body).toHaveProperty('movie.title', movie.title);
        });
    });
});
