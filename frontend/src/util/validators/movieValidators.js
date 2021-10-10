const Joi = require('joi');
const { movie } = require('../modelConstraints');

const titleError = `Title should be between ${movie.title.min} and ${movie.title.max} characters`;
const titleSchema = Joi.string()
  .min(movie.title.min)
  .max(movie.title.max)
  .required()
  .messages({
    'string.empty': titleError,
    'string.min': titleError,
    'string.max': titleError,
  });

const rentalRateError = `Daily Rental Rate should be a number between ${movie.dailyRentalRate.min} and ${movie.dailyRentalRate.max}`;
const rentalRateSchema = Joi.number()
  .precision(2)
  .min(movie.dailyRentalRate.min)
  .max(movie.dailyRentalRate.max)
  .required()
  .messages({
    'number.base': rentalRateError,
    'number.min': rentalRateError,
    'number.max': rentalRateError,
  });

const numInStockError = `Number In Stock should be an integer between ${movie.numberInStock.min} and ${movie.numberInStock.max}`;
const numInStockSchema = Joi.number()
  .integer()
  .min(movie.numberInStock.min)
  .max(movie.numberInStock.max)
  .required()
  .messages({
    'number.base': numInStockError,
    'number.min': numInStockError,
    'number.max': numInStockError,
  });

const genresError = `Please select between ${movie.genres.min} and ${movie.genres.max} genres`;
const genresSchema = Joi.array()
  .min(movie.genres.min)
  .max(movie.genres.max)
  .messages({
    'array.min': genresError,
    'array.max': genresError,
  });

module.exports = {
  validateTitle(title) {
    return titleSchema.validate(title);
  },
  validateRentalRate(rentalRate) {
    return rentalRateSchema.validate(rentalRate);
  },
  validateNumInStock(numInStock) {
    return numInStockSchema.validate(numInStock);
  },
  validateGenres(genres) {
    return genresSchema.validate(genres);
  },
};
