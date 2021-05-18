const request = require('supertest');
const moment = require('moment');
const { User } = require('../../models/user');
const { Rental } = require('../../models/rental');
const { Movie } = require('../../models/movie');

describe('/api/returns', () => {
    let server;
    let rental;
    let customerId;
    let movieId;
    let token;

    const exec = () => {
        return request(server)
            .post('/api/returns')
            .set('x-auth-token', token)
            .send({ customerId, movieId });
    };

    beforeEach(async () => {
        server = await require('../../index');

        rental = new Rental({
            customer: {
                name: 'Customer Name',
                phone: '12345678910'
            },
            movie: {
                title: 'Movie Title',
                dailyRentalRate: 2
            }
        });
        await rental.save();
        customerId = rental.customer._id;
        movieId = rental.movie._id;

        token = new User({ isAdmin: true }).generateAuthToken();
    });

    afterEach(async () => {
        await Rental.deleteMany();
        await Movie.deleteMany();
        await server.close();
    });
    
    it('should return 401 if client is not logged in', async () => {
        token = '';

        const res = await exec();

        expect(res.status).toBe(401);
    });
    it('should return 400 if customerId is not provided', async () => {
        customerId = '';

        const res = await exec();

        expect(res.status).toBe(400);
    });
    it('should return 400 if movieId is not provided', async () => {
        movieId = '';

        const res = await exec();

        expect(res.status).toBe(400);
    });
    it('should return 404 if no rental found for customer/movie', async () => {
        await Rental.deleteMany();

        const res = await exec();

        expect(res.status).toBe(404);
    });
    it('should return 400 if return already processed', async () => {
        await rental.return();

        const res = await exec();

        expect(res.status).toBe(400);
    });
    it('should return 200 if request is valid', async () => {
        const res = await exec();

        expect(res.status).toBe(200);
    });
    it('should set return date if request is valid', async () => {
        await exec();

        const rentalInDB = await Rental.findById(rental._id);
        const diff = Date.now() - rentalInDB.dateReturned;

        expect(diff).toBeLessThan(10 * 1000);
    });
    it('should calculate rental fee if request is valid', async () => {
        rental.dateOut = moment().add(-7, 'days').toDate();
        await rental.return();

        await exec();

        const rentalInDB = await Rental.findById(rental._id);

        expect(rentalInDB.rentalFee).toBe(14);
    });
    it('should increment stock if request is valid', async () => {
        await Movie.create({
            _id: movieId,
            title: rental.movie.title,
            genres: [{ name: 'Genre Name' }],
            numberInStock: 0,
            dailyRentalRate: rental.movie.dailyRentalRate
        });
        
        await exec();

        const movie = await Movie.findById(movieId);

        expect(movie.numberInStock).toBe(1);
    });
    it('should return the rental if request is valid', async () => {
        const res = await exec();

        expect(Object.keys(res.body)).toEqual(
            expect.arrayContaining(
                ['customer', 'movie', 'rentalFee', 'dateOut', 'dateReturned']
            )
        );
    });
});