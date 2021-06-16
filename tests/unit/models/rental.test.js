const mongoose = require('mongoose');
const moment = require('moment');
const db = require('../../../startup/config').db;
const { Customer } = require('../../../models/customer');
const { Movie } = require('../../../models/movie');
const { Rental, validate } = require('../../../models/rental');

describe('Rental model', () => {
  let rental;

  describe('mongodb access functions', () => {
    beforeAll(async () => {
      await mongoose.connect(db + '_rental', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
      });
    });

    beforeEach(async () => {
      rental = await new Rental({
        customer: new Customer({
          name: 'Customer Name',
          phone: 'Customer Phone'
        }),
        movie: new Movie({
          title: 'Movie Title',
          dailyRentalRate: 0.99
        })
      }).save();
    });

    afterEach(async () => {
      await Rental.deleteMany();
    });

    afterAll(async () => {
      await mongoose.disconnect();
    });

    describe('Rental.lookup', () => {
      it('should return null if customerId is not found', async () => {
        const rentalInDB = await Rental.lookup(
          mongoose.Types.ObjectId(),
          rental.movie._id
        );

        expect(rentalInDB).toBeNull();
      });

      it('should return null if movieId is not found', async () => {
        const rentalInDB = await Rental.lookup(
          rental.customer._id,
          mongoose.Types.ObjectId()
        );

        expect(rentalInDB).toBeNull();
      });

      it('should return rental if both customerId and movieId are found', async () => {
        const rentalInDB = await Rental.lookup(
          rental.customer._id,
          rental.movie._id
        );

        expect(rentalInDB).toHaveProperty(
          'customer.name',
          rental.customer.name
        );
        expect(rentalInDB).toHaveProperty(
          'customer.phone',
          rental.customer.phone
        );
        expect(rentalInDB).toHaveProperty('movie.title', rental.movie.title);
        expect(rentalInDB).toHaveProperty(
          'movie.dailyRentalRate',
          rental.movie.dailyRentalRate
        );
      });
    });

    describe('rental.return', () => {
      it('should set dateReturned', async () => {
        await rental.return();

        expect(rental).toHaveProperty('dateReturned');
      });

      it('should set rentalFee', async () => {
        rental.dateOut = moment().add(-7, 'days').toDate();
        await rental.save();

        await rental.return();

        expect(rental).toHaveProperty(
          'rentalFee',
          rental.movie.dailyRentalRate * 7
        );
      });

      it('should set dateReturned and rentalFee in db', async () => {
        await rental.return();

        const rentalInDB = await Rental.findById(rental._id);

        expect(rentalInDB).toHaveProperty('dateReturned');
        expect(rentalInDB).toHaveProperty('rentalFee');
      });
    });
  });

  describe('validate', () => {
    beforeEach(() => {
      rental = {
        customerId: mongoose.Types.ObjectId().toHexString(),
        movieId: mongoose.Types.ObjectId().toHexString()
      };
    });

    it('should return error if rental contains an invalid property', () => {
      rental.invalid = 'invalid';

      const { error } = validate(rental);

      expect(error.message).toMatch(/not.*allowed/);
    });

    it('should return error if customerId is undefined', () => {
      delete rental.customerId;

      const { error } = validate(rental);

      expect(error.message).toMatch(/customerId.*required/);
    });

    it('should return error if customerId is a not a string', () => {
      rental.customerId = mongoose.Types.ObjectId();

      const { error } = validate(rental);

      expect(error.message).toMatch(/customerId.*string/);
    });

    it('should return error if customerId is empty', () => {
      rental.customerId = '';

      const { error } = validate(rental);

      expect(error.message).toMatch(/customerId.*empty/);
    });

    it('should return error if customerId is not hexadecimal', () => {
      rental.customerId = '0aG'.repeat(8);

      const { error } = validate(rental);

      expect(error.message).toMatch(/customerId.*fails.*valid.*id/);
    });

    it('should not return error if customerId is a 24-digit hex string', () => {
      rental.customerId = '0aF'.repeat(8);

      const { error } = validate(rental);

      expect(error).toBe(undefined);
    });

    it('should not return error if customerId is a valid objectId string', () => {
      rental.customerId = mongoose.Types.ObjectId().toHexString();

      const { error } = validate(rental);

      expect(error).toBe(undefined);
    });

    it('should return error if movieId is undefined', () => {
      delete rental.movieId;

      const { error } = validate(rental);

      expect(error.message).toMatch(/movieId.*required/);
    });

    it('should return error if movieId is not a string', () => {
      rental.movieId = mongoose.Types.ObjectId();

      const { error } = validate(rental);

      expect(error.message).toMatch(/movieId.*string/);
    });

    it('should return error if movieId is empty', () => {
      rental.movieId = '';

      const { error } = validate(rental);

      expect(error.message).toMatch(/movieId.*empty/);
    });

    it('should return error if movieId is not hexadecimal', () => {
      rental.movieId = '0aG'.repeat(8);

      const { error } = validate(rental);

      expect(error.message).toMatch(/movieId.*fails.*valid.*id/);
    });

    it('should not return error if movieId is a 24-digit hex string', () => {
      rental.movieId = '0aF'.repeat(8);

      const { error } = validate(rental);

      expect(error).toBe(undefined);
    });

    it('should not return error if movieId is a valid objectId string', () => {
      rental.movieId = mongoose.Types.ObjectId().toHexString();

      const { error } = validate(rental);

      expect(error).toBe(undefined);
    });
  });
});
