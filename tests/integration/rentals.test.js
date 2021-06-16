const mongoose = require('mongoose');
const test = require('../../testSetup');
const app = require('../../startup/app');
const { User } = require('../../models/user');
const { Customer } = require('../../models/customer');
const { Genre } = require('../../models/genre');
const { Movie } = require('../../models/movie');
const { Rental } = require('../../models/rental');

const { getAll, getOne, post, del } = test.request;

describe('/api/rentals', () => {
  test.setup('rentals', app);

  let token = new User({ isAdmin: false }).generateAuthToken();
  let customer;
  let movieObject;
  let movie;
  let rentalObject;
  let req;

  beforeAll(async () => {
    customer = await new Customer({
      name: 'Customer Name',
      phone: '12345'
    }).save();
    movieObject = {
      title: 'Movie Title',
      dailyRentalRate: 1,
      numberInStock: 1,
      genres: [new Genre({ name: 'Genre Name' })]
    };
    movie = await new Movie(movieObject).save();
    rentalObject = { customer, movie };
  });

  describe('GET /', () => {
    const find = Rental.find;
    let customer2;
    let movie2;

    beforeAll(async () => {
      customer2 = await new Customer({
        name: 'Customer Name 2',
        phone: '12345'
      }).save();
      movie2 = await new Movie({
        title: 'Movie Title 2',
        dailyRentalRate: 2,
        numberInStock: 2,
        genres: [new Genre({ name: 'Genre Name 2' })]
      }).save();
      await Rental.insertMany([
        rentalObject,
        { customer: customer2, movie: movie2 }
      ]);
    });

    beforeEach(async () => {
      req = { token };
    });

    afterEach(async () => {
      Rental.find = find;
    });

    afterAll(async () => {
      await Rental.deleteMany();
    });

    it('should return 401 if client is not logged in', async () => {
      await test.tokenEmpty(getAll, req);
    });

    it('should return 400 if token is invalid', async () => {
      await test.tokenInvalid(getAll, req);
    });

    it('should return 500 if an uncaughtException is encountered', async () => {
      Rental.find = jest.fn(() => {
        throw new Error('fake uncaught exception');
      });

      const res = await getAll(req);

      expect(res.status).toBe(500);
      expect(res.text).toMatch(/Something failed/);
    });

    it('should return all rentals if client is logged in', async () => {
      const res = await getAll(req);

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(
        res.body.some(
          (r) =>
            r.customer.name === customer.name &&
            r.customer.phone === customer.phone &&
            r.customer.isGold === customer.isGold &&
            r.movie.title === movie.title &&
            r.movie.dailyRentalRate === movie.dailyRentalRate
        )
      ).toBe(true);
      expect(
        res.body.some(
          (r) =>
            r.customer.name === customer2.name &&
            r.customer.phone === customer2.phone &&
            r.customer.isGold === customer2.isGold &&
            r.movie.title === movie2.title &&
            r.movie.dailyRentalRate === movie2.dailyRentalRate
        )
      ).toBe(true);
    });
  });

  describe('GET /:id', () => {
    let rental;

    beforeAll(async () => {
      rental = await new Rental(rentalObject).save();
    });

    beforeEach(() => {
      req = { token, id: rental._id };
    });

    afterAll(async () => {
      await Rental.deleteMany();
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

    it('should return the rental if request is valid', async () => {
      const res = await getOne(req);

      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('customer.name', customer.name);
      expect(res.body).toHaveProperty('movie.title', movie.title);
    });
  });

  describe('POST /', () => {
    beforeEach(async () => {
      movie = await new Movie(movieObject).save();
      req = {
        token,
        body: {
          customerId: customer._id,
          movieId: movie._id
        }
      };
    });

    afterEach(async () => {
      await Movie.deleteMany();
      await Rental.deleteMany();
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

    it('should return 400 if customer is not found', async () => {
      req.body.customerId = mongoose.Types.ObjectId().toHexString();

      const res = await post(req);

      expect(res.status).toBe(400);
      expect(res.text).toMatch(/[Cc]ustomer/);
    });

    it('should return 400 if movie is not found', async () => {
      req.body.movieId = mongoose.Types.ObjectId().toHexString();

      const res = await post(req);

      expect(res.status).toBe(400);
      expect(res.text).toMatch(/[Mm]ovie/);
    });

    it('should return 400 if movie is out of stock', async () => {
      await Movie.updateOne({ _id: movie._id }, { $set: { numberInStock: 0 } });

      const res = await post(req);

      expect(res.status).toBe(400);
      expect(res.text).toMatch(/[Mm]ovie.*[Ss]tock/);
    });

    it('should return 400 if active rental exists for customer and movie', async () => {
      await Rental.create({ customer, movie });

      const res = await post(req);

      expect(res.status).toBe(400);
      expect(res.text).toMatch(/[Aa]lready.*[Rr]ent/);
    });

    it('should save the rental and decrease the movie stock if request is valid', async () => {
      await post(req);

      const movieInDB = await Movie.findById(movie._id);
      const rentalInDB = await Rental.findOne({
        'customer._id': customer._id,
        'movie._id': movie._id
      });

      expect(movieInDB.numberInStock).toBe(movie.numberInStock - 1);
      expect(rentalInDB).toHaveProperty('_id');
      expect(rentalInDB).toHaveProperty('customer._id', customer._id);
      expect(rentalInDB).toHaveProperty('movie._id', movie._id);
    });

    it('should return the rental if request is valid', async () => {
      const res = await post(req);

      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('customer._id');
      expect(res.body).toHaveProperty('customer.name', customer.name);
      expect(res.body).toHaveProperty('movie._id');
      expect(res.body).toHaveProperty('movie.title', movie.title);
    });
  });

  describe('DELETE /:id', () => {
    token = new User({ isAdmin: true }).generateAuthToken();
    let rental;

    beforeEach(async () => {
      movie = await new Movie(movieObject).save();
      rental = await new Rental({ customer, movie }).save();
      req = { token, id: rental._id };
    });

    afterEach(async () => {
      await Rental.deleteMany();
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

    it('should increase the movie stock and delete the rental if it has not already been returned', async () => {
      await del(req);

      const movieInDB = await Movie.findById(movie._id);
      const rentalInDB = await Rental.findOne({
        'customer._id': customer._id,
        'movie._id': movie._id
      });

      expect(movieInDB.numberInStock).toBe(movie.numberInStock + 1);
      expect(rentalInDB).toBeNull();
    });

    it('should only delete the rental if it has already been returned', async () => {
      await rental.return();
      const movieBefore = await Movie.findById(movie._id);

      await del(req);

      const movieInDB = await Movie.findById(movie._id);
      const rentalInDB = await Rental.findOne({
        'customer._id': customer._id,
        'movie._id': movie._id
      });

      expect(movieInDB.numberInStock).toBe(movieBefore.numberInStock);
      expect(rentalInDB).toBeNull();
    });

    it('should return the rental if request is valid', async () => {
      const res = await del(req);

      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('customer._id');
      expect(res.body).toHaveProperty('customer.name', customer.name);
      expect(res.body).toHaveProperty('movie._id');
      expect(res.body).toHaveProperty('movie.title', movie.title);
    });
  });
});
