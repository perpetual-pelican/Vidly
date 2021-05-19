const Joi = require('joi');

describe('validation', () => {
    it('should enable joi-objectid', () => {
        require('../../../startup/validation')();

        expect(Joi.objectId).toBeDefined();
    });
});