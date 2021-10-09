const Joi = require('joi');
const { genre } = require('../modelConstraints');

const errorMessage = `Genre Name should be between ${genre.name.min} and ${genre.name.max} characters`;
const nameSchema = Joi.string()
  .min(genre.name.min)
  .max(genre.name.max)
  .required()
  .messages({
    'string.empty': errorMessage,
    'string.min': errorMessage,
    'string.max': errorMessage,
  });

module.exports = {
  validateName(name) {
    return nameSchema.validate(name);
  },
};
