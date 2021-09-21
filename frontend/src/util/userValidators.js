const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity').default;
const tlds = require('@sideway/address/lib/tlds');
const { user } = require('./modelConstraints');

const nameSchema = Joi.string().max(user.name.max).required();

const emailSchema = Joi.string()
  .email({
    tlds: {
      allow: tlds,
    },
  })
  .required();

const passwordSchema = passwordComplexity({
  min: user.password.min,
  max: user.password.max,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 4,
}).required();

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
      return { error: true };
    } else {
      return {};
    }
  },
};
