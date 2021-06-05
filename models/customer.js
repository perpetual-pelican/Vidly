const mongoose = require('mongoose');
const Joi = require('joi');

const name = { min: 3, max: 128 };
const phone = { min: 5, max: 32 };

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minLength: name.min,
        maxLength: name.max
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        minLength: phone.min,
        maxLength: phone.max
    },
    isGold: {
        type: Boolean,
        default: false
    }
});

const Customer = mongoose.model('Customer', customerSchema);

const joiSchema = {
    name: Joi.string().min(name.min).max(name.max),
    phone: Joi.string().min(phone.min).max(phone.max),
    isGold: Joi.boolean()
};

function validatePost(customer) {
    const postSchema = Joi.object({
        name: joiSchema.name.required(),
        phone: joiSchema.phone.required(),
        isGold: joiSchema.isGold
    });

    return postSchema.validate(customer);
}

function validatePut(customer) {
    const putSchema = Joi.object(joiSchema);

    if (Object.keys(customer).length === 0)
        return { error: new Error('At least one property is required to update customer') };

    return putSchema.validate(customer);
}

exports.customerSchema = customerSchema;
exports.Customer = Customer;
exports.validatePost = validatePost;
exports.validatePut = validatePut;
exports.bounds = { name, phone };