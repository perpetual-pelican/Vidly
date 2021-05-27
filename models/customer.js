const mongoose = require('mongoose');
const Joi = require('joi');

const Customer = mongoose.model('Customer', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 128
    },
    phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 32
    },
    isGold: {
        type: Boolean,
        default: false
    }
}));

function validatePost(customer) {
    const postSchema = Joi.object({
        name: Joi.string().min(3).max(128).required(),
        phone: Joi.string().min(5).max(32).required(),
        isGold: Joi.boolean()
    });
    return postSchema.validate(customer);
}

function validatePut(customer) {
    const putSchema = Joi.object({
        name: Joi.string().min(3).max(128),
        phone: Joi.string().min(5).max(32),
        isGold: Joi.boolean()
    });

    if (Object.keys(customer).length === 0)
        return { error: new Error('At least one property is required to update customer') };

    return putSchema.validate(customer);
}

exports.Customer = Customer;
exports.validatePost = validatePost;
exports.validatePut = validatePut;