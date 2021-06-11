const mongoose = require('mongoose');
const Joi = require('joi');

const name = { min: 3, max: 128};

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: name.min,
        maxlength: name.max
    }
});

const Genre = mongoose.model('Genre', genreSchema);

function validate(genre) {
    const postSchema = Joi.object({
        name: Joi.string().min(name.min).max(name.max).required()
    });
    return postSchema.validate(genre);
}

exports.genreSchema = genreSchema;
exports.Genre = Genre;
exports.validate = validate;
exports.bounds = { name };