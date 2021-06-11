const moment = require('moment');
const test = require('../../testSetup');
const app = require('../../startup/app');
const { User } = require('../../models/user');
const { Movie } = require('../../models/movie');
const { Rental } = require('../../models/rental');

const { post } = test.request;

describe('/api/returns', () => {
    test.setup('returns', app);

    const lookup = Rental.lookup;
    const token = new User({ isAdmin: false }).generateAuthToken();
    let rental;
    let returnObject;
    let req;

    beforeEach(async () => {
        rental = await new Rental({
            customer: {
                name: 'Customer Name',
                phone: '12345'
            },
            movie: {
                title: 'Movie Title',
                dailyRentalRate: 2
            }
        }).save();
        returnObject = {
            customerId: rental.customer._id,
            movieId: rental.movie._id
        };
        req = { token, body: returnObject };
    });

    afterEach(async () => {
        Rental.lookup = lookup;
        await Movie.deleteMany();
        await Rental.deleteMany();
    });
    
    it('should return 401 if client is not logged in', async () => {
        await test.tokenEmpty(post, req);
    });

    it('should return 400 if customerId is undefined', async () => {
        delete req.body.customerId;

        const res = await post(req);

        expect(res.status).toBe(400);
        expect(res.text).toMatch(/customerId.*required/);
    });

    it('should return 400 if movieId is undefined', async () => {
        delete req.body.movieId;

        const res = await post(req);

        expect(res.status).toBe(400);
        expect(res.text).toMatch(/movieId.*required/);
    });

    it('should return 404 if no rental found for customer/movie', async () => {
        await Rental.deleteMany();

        const res = await post(req);

        expect(res.status).toBe(404);
        expect(res.text).toMatch(/[Nn]ot.*[Ff]ound/);
    });

    it('should return 400 if return was already processed', async () => {
        await rental.return();

        const res = await post(req);

        expect(res.status).toBe(400);
        expect(res.text).toMatch(/[Rr]eturn/);
    });

    it('should return 500 if an uncaughtException is encountered', async () => {
        Rental.lookup = jest.fn(() => { throw new Error('fake uncaught exception'); });

        const res = await post(req);

        expect(res.status).toBe(500);
        expect(res.text).toMatch(/Something failed/);
    });

    it('should set return date if request is valid', async () => {
        await post(req);

        const rentalInDB = await Rental.findById(rental._id);
        const diff = Date.now() - rentalInDB.dateReturned;

        expect(diff).toBeLessThan(10 * 1000);
    });

    it('should calculate rental fee if request is valid', async () => {
        rental.dateOut = moment().add(-7, 'days').toDate();
        await rental.save();

        await post(req);

        const rentalInDB = await Rental.findById(rental._id);

        expect(rentalInDB.rentalFee).toBe(7 * rental.movie.dailyRentalRate);
    });

    it('should update the rental and increase the movie stock if request is valid', async () => {
        const movie = await new Movie({
            _id: returnObject.movieId,
            title: rental.movie.title,
            genres: [{ name: 'Genre Name' }],
            numberInStock: 0,
            dailyRentalRate: rental.movie.dailyRentalRate
        }).save();
        
        await post(req);

        const rentalInDB = await Rental.findById(rental._id);
        const movieInDB = await Movie.findById(returnObject.movieId);

        expect(rentalInDB).toHaveProperty('dateReturned');
        expect(rentalInDB).toHaveProperty('rentalFee');
        expect(movieInDB.numberInStock).toBe(movie.numberInStock + 1);
    });

    it('should return the rental if request is valid', async () => {
        const res = await post(req);

        expect(res.status).toBe(200);
        expect(Object.keys(res.body)).toEqual(
            expect.arrayContaining(
                ['customer', 'movie', 'dateOut', 'dateReturned', 'rentalFee']
            )
        );
    });
});
