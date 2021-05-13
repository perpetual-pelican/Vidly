const mongoose = require('mongoose');
const Joi = require('joi');
const { genreSchema } = require('../models/genre');

genreSchema.remove('unique');

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
    tags: {
        type: [String],
        max: 128
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
        tags: Joi.array().items(Joi.string().min(3).max(128)).max(128),
        numberInStock: Joi.number().min(0).max(1000).required(),
        dailyRentalRate: Joi.number().min(0).max(20).required()
    });
    return postSchema.validate(movie);
}

function validatePut(movie) {
    const putSchema = Joi.object({
        title: Joi.string().min(3).max(128),
        genreIds: Joi.array().items(Joi.objectId()).min(1),
        tags: Joi.array().items(Joi.string().min(3).max(128)).max(128),
        numberInStock: Joi.number().min(0).max(1000),
        dailyRentalRate: Joi.number().min(0).max(20)
    });
    return putSchema.validate(movie);
}

exports.Movie = Movie;
exports.validatePost = validatePost;
exports.validatePut = validatePut;