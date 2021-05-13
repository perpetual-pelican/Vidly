const mongoose = require('mongoose');
const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 128
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 128
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 255
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
    return token;
};

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(128).required(),
        email: Joi.string().min(3).max(128).email().required(),
        password: passwordComplexity().required()
    });
    return schema.validate(user);
}

exports.User = User;
exports.validateUser = validateUser;