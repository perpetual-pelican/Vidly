const request = require('supertest');
const mongoose = require('mongoose');
const { User } = require('../../../models/user');
const { Customer } = require('../../../models/customer');
const { Genre } = require('../../../models/genre');
const { Movie } = require('../../../models/movie');
const { Rental } = require('../../../models/rental');

describe('/api/rentals', () => {
    let server;
    let token;
    let customer;
    let genre;
    let movie;

    beforeEach(async () => {
        server = await require('../../../index');

        token = new User().generateAuthToken();

        customer = await new Customer({
            name: 'customerName',
            phone: 'phone'
        }).save();

        genre = await new Genre({ name: 'genreName' }).save();

        movie = await new Movie({
            title: 'movieTitle',
            genres: [genre],
            numberInStock: 1,
            dailyRentalRate: 1
        }).save();
    });

    afterEach(async () => {
        await server.close();
        await Customer.deleteMany();
        await Genre.deleteMany();
        await Movie.deleteMany();
        await Rental.deleteMany();
    });

    describe('GET /', () => {
        let customer2;
        let genre2;
        let movie2;

        beforeEach(async () => {
            customer2 = await new Customer({
                name: 'customerName2',
                phone: 'phone2'
            }).save();
    
            genre2 = await new Genre({ name: 'genreName2' }).save();
    
            movie2 = await new Movie({
                title: 'movieTitle2',
                genres: [genre2],
                numberInStock: 1,
                dailyRentalRate: 2
            }).save();

            await Rental.insertMany([
                {
                    customer: {
                        _id: customer._id,
                        name: customer.name,
                        phone: customer.phone,
                        isGold: customer.isGold
                    },
                    movie: {
                        _id: movie._id,
                        title: movie.title,
                        dailyRentalRate: movie.dailyRentalRate
                    }
                },
                {
                    customer: {
                        _id: customer2._id,
                        name: customer2.name,
                        phone: customer2.phone,
                        isGold: customer2.isGold
                    },
                    movie: {
                        _id: movie2._id,
                        title: movie2.title,
                        dailyRentalRate: movie2.dailyRentalRate
                    }
                }
            ]);
        });

        const exec = () => {
            return request(server)
                .get('/api/rentals')
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

        it('should return all rentals if client is logged in', async () => {
            const res = await exec();

            expect(res.body.length).toBe(2);
            expect(res.body.some(r =>
                r.customer.name === customer.name &&
                r.movie.title === movie.title
            )).toBe(true);
            expect(res.body.some(r =>
                r.customer.name === customer2.name &&
                r.movie.title === movie2.title
            )).toBe(true);
        });
    });

    describe('GET /:id', () => {
        let rental;
        let id;

        beforeEach(async () => {
            rental = new Rental({
                customer: {
                    _id: customer._id,
                    name: customer.name,
                    phone: customer.phone,
                    isGold: customer.isGold
                },
                movie: {
                    _id: movie._id,
                    title: movie.title,
                    dailyRentalRate: movie.dailyRentalRate
                }
            });
            await rental.save();

            id = rental._id;
        });

        const exec = () => {
            return request(server)
                .get('/api/rentals/' + id)
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

        it('should return 404 if id is not found', async () => {
            id = mongoose.Types.ObjectId().toHexString();

            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return the rental if it is found', async () => {
            const res = await exec();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('customer.name', customer.name);
            expect(res.body).toHaveProperty('movie.title', movie.title);
        });
    });

    describe('POST /', () => {
        let rental;

        beforeEach(async () => {
            rental = {
                customerId: customer._id,
                movieId: movie._id
            };
        });

        const exec = () => {
            return request(server)
                .post('/api/rentals')
                .set('x-auth-token', token)
                .send(rental);
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
            delete rental.customerId;

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if customer is not found', async () => {
            rental.customerId = mongoose.Types.ObjectId().toHexString();

            const res = await exec();

            expect(res.status).toBe(400);
            expect(res.text).toMatch(/customer/);
        });

        it('should return 400 if movie is not found', async () => {
            rental.movieId = mongoose.Types.ObjectId().toHexString();

            const res = await exec();

            expect(res.status).toBe(400);
            expect(res.text).toMatch(/movie/);
        });

        it('should return 400 if movie is out of stock', async () => {
            await Movie.updateOne({ _id: movie._id }, { $set: { numberInStock: 0 } });

            const res = await exec();

            expect(res.status).toBe(400);
            expect(res.text).toMatch(/movie/);
        });

        it('should save the rental and decrement the movie stock if request is valid', async () => {
            await exec();

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
            const res = await exec();

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

            rental = new Rental({
                customer: {
                    _id: customer._id,
                    name: customer.name,
                    phone: customer.phone,
                    isGold: customer.isGold
                },
                movie: {
                    _id: movie._id,
                    title: movie.title,
                    dailyRentalRate: movie.dailyRentalRate
                }
            });
            await rental.save();

            id = rental._id;
        });

        const exec = () => {
            return request(server)
                .delete('/api/rentals/' + id)
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

        it('should return 403 if token is invalid', async () => {
            token = new User({ isAdmin: false }).generateAuthToken();

            const res = await exec();

            expect(res.status).toBe(403);
        });

        it('should return 404 if id is invalid', async () => {
            id = 'invalid';

            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 404 if id is not found', async () => {
            id = mongoose.Types.ObjectId().toHexString();

            const res = await exec();

            expect(res.status).toBe(404);
            expect(res.text).toMatch(/not.*found/);
        });

        it('should delete the rental and increment the movie stock if request is valid', async () => {
            await exec();

            const rentalInDB = await Rental.findOne({
                'customer._id': customer._id,
                'movie._id': movie._id
            });

            const movieInDB = await Movie.findById(movie._id);

            expect(rentalInDB).toBeNull();

            expect(movieInDB.numberInStock).toBe(movie.numberInStock + 1);
        });

        it('should return the rental if request is valid', async () => {
            const res = await exec();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('customer._id');
            expect(res.body).toHaveProperty('customer.name', customer.name);
            expect(res.body).toHaveProperty('movie._id');
            expect(res.body).toHaveProperty('movie.title', movie.title);
        });
    });
});
