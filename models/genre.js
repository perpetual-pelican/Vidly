const mongoose = require('mongoose');
const Joi = require('joi');

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        minlength: 3,
        maxlength: 128
    }
});

const Genre = mongoose.model('Genre', genreSchema);

function validatePost(genre) {
    const postSchema = Joi.object({
        name: Joi.string().min(3).max(128).required()
    });
    return postSchema.validate(genre);
}

function validatePut(genre) {
    const putSchema = Joi.object({
        name: Joi.string().min(3).max(128).required()
    });
    return putSchema.validate(genre);
}

exports.genreSchema = genreSchema;
exports.Genre = Genre;
exports.validatePost = validatePost;
exports.validatePut = validatePut;