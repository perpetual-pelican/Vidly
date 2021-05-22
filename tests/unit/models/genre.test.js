const { Genre, validate } = require('../../../models/genre');

describe('validate', () => {
    let genre;

    beforeEach(() => {
        genre = {
            name: 'name'
        };
    });

    it('should return error if name is not provided', () => {
        delete genre.name;

        const { error } = validate(genre);

        expect(error.details[0].message).toMatch(/name.*required/);
    });
    it('should return error if name is not a string', () => {
        genre.name = {};

        const { error } = validate(genre);

        expect(error.details[0].message).toMatch(/name.*string/);
    });

    it('should return error if name is less than 3 characters', () => {
        genre.name = '12';

        const { error } = validate(genre);

        expect(error.details[0].message).toMatch(/name.*3/);
    });

    it('should return error if name is greater than 128 characters', () => {
        genre.name = new Array(130).join('a');

        const { error } = validate(genre);

        expect(error.details[0].message).toMatch(/name.*128/);
    });

    it('should not return error if name is valid', () => {
        const { error } = validate(genre);

        expect(error).not.toBeDefined();
    });
});
