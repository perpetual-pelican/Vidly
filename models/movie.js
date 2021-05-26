const mongoose = require('mongoose');
const Joi = require('joi');
const { genreSchema } = require('../models/genre');

const Movie = mongoose.model('Movie', new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 128
    },
    genres: {
        type: [genreSchema],
        required: true
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 1000
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 20
    }
}));

function validatePost(movie) {
    const postSchema = Joi.object({
        title: Joi.string().min(3).max(128).required(),
        genreIds: Joi.array().items(Joi.objectId()).min(1).required(),
        numberInStock: Joi.number().min(0).max(1000).required(),
        dailyRentalRate: Joi.number().min(0).max(20).required()
    });
    return postSchema.validate(movie);
}

function validatePut(movie) {
    const putSchema = Joi.object({
        title: Joi.string().min(3).max(128),
        genreIds: Joi.array().items(Joi.objectId()).min(1),
        numberInStock: Joi.number().min(0).max(1000),
        dailyRentalRate: Joi.number().min(0).max(20)
    });

    if (Object.keys(movie).length === 0)
        return { error: new Error('At least one property is required to update movie') };

    return putSchema.validate(movie);
}

exports.Movie = Movie;
exports.validatePost = validatePost;
exports.validatePut = validatePut;