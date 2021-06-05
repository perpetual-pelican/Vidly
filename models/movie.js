const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const { genreSchema } = require('../models/genre');

const title = { min: 3, max: 128 };
const dailyRentalRate = { min: 0, max: 20 };
const numberInStock = { min: 0, max: 1000 };
const genres = { min: 1, max: 10 };

const movieSchemaFields = {
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: title.min,
        maxlength: title.max
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: dailyRentalRate.min,
        max: dailyRentalRate.max
    }
};

const Movie = mongoose.model('Movie', new mongoose.Schema({
    title: movieSchemaFields.title,
    dailyRentalRate: movieSchemaFields.dailyRentalRate,
    numberInStock: {
        type: Number,
        required: true,
        min: numberInStock.min,
        max: numberInStock.max
    },
    genres: {
        type: [genreSchema],
        default: undefined,
        unique: true,
        min: genres.min,
        max: genres.max
    }
}));

const joiSchema = {
    title: Joi.string().min(title.min).max(title.max),
    dailyRentalRate: Joi.number().precision(2).min(dailyRentalRate.min).max(dailyRentalRate.max),
    numberInStock: Joi.number().integer().min(numberInStock.min).max(numberInStock.max),
    genreIds: Joi.array().items(Joi.objectId()).min(genres.min).max(genres.max).unique()
};

function validatePost(movie) {
    const postSchema = Joi.object({
        title: joiSchema.title.required(),
        dailyRentalRate: joiSchema.dailyRentalRate.required(),
        numberInStock: joiSchema.numberInStock.required(),
        genreIds: joiSchema.genreIds
    });
    return postSchema.validate(movie);
}

function validatePut(movie) {
    const putSchema = Joi.object(joiSchema);

    if (Object.keys(movie).length === 0)
        return { error: new Error('At least one property is required to update movie') };

    return putSchema.validate(movie);
}

exports.movieSchemaFields = movieSchemaFields;
exports.Movie = Movie;
exports.validatePost = validatePost;
exports.validatePut = validatePut;
exports.bounds = { title, genres, numberInStock, dailyRentalRate };