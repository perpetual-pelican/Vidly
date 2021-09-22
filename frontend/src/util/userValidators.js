const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity').default;
const tlds = require('@sideway/address/lib/tlds');
const { user } = require('./modelConstraints');

const nameSchema = Joi.string()
  .max(user.name.max)
  .required()
  .messages({
    'string.empty': 'Name is required',
    'string.max': `Name should be ${user.name.max} characters or less`,
  });

const emailError = 'Please enter a valid email';
const emailSchema = Joi.string()
  .email({
    tlds: {
      allow: tlds,
    },
  })
  .required()
  .messages({
    'string.empty': emailError,
    'string.email': emailError,
  });

const passwordError = `Password must be between ${user.password.min} and ${user.password.max} characters and include 1 lowercase, 1 uppercase, 1 number, and 1 symbol`;
const passwordSchema = passwordComplexity({
  min: user.password.min,
  max: user.password.max,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 4,
})
  .required()
  .messages({
    'string.empty': passwordError,
    'passwordComplexity.tooShort': passwordError,
    'passwordComplexity.tooLong': passwordError,
    'passwordComplexity.lowercase': passwordError,
    'passwordComplexity.uppercase': passwordError,
    'passwordComplexity.numeric': passwordError,
    'passwordComplexity.symbol': passwordError,
  });

module.exports = {
  validateName(name) {
    return nameSchema.validate(name);
  },
  validateEmail(email) {
    return emailSchema.validate(email);
  },
  validatePassword(password) {
    return passwordSchema.validate(password);
  },
  validatePasswordMatch(password, confirm) {
    if (password !== confirm) {
      return { error: { details: [{ message: "Passwords don't match" }] } };
    } else {
      return { value: password };
    }
  },
};
