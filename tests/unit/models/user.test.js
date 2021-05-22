const config = require('config');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { User, validateUser } = require('../../../models/user');

describe('user.generateAuthToken', () => {
    it('should return a valid JSON Web Token', () => {
        const user = {
            _id: mongoose.Types.ObjectId().toHexString(),
            isAdmin: true
        };
        const token = new User(user).generateAuthToken();
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));

        expect(decoded).toMatchObject(user);
    });
});

describe('validateUser', () => {
    let user;

    beforeEach(() => {
        user = {
            name: "name",
            email: "user@domain.com",
            password: "abcdeF1$"
        };
    });

    it('should return error if name is not provided', () => {
        delete user.name;

        const { error } = validateUser(user);

        expect(error.details[0].message).toMatch(/name.*required/);
    });

    it('should return error if name is not string', () => {
        user.name = {};

        const { error } = validateUser(user);

        expect(error.details[0].message).toMatch(/name.*string/);
    });

    it('should return error if name length is shorter than 3', () => {
        user.name = "12";

        const { error } = validateUser(user);

        expect(error.details[0].message).toMatch(/name.*3/);
    });

    it('should return error if name length is greater than 128', () => {
        user.name = new Array(130).join('a');

        const { error } = validateUser(user);

        expect(error.details[0].message).toMatch(/name.*128/);
    });

    it('should return error if email is not provided', () => {
        delete user.email;

        const { error } = validateUser(user);

        expect(error.details[0].message).toMatch(/email.*required/);
    });

    it('should return error if email is not string', () => {
        user.email = {};

        const { error } = validateUser(user);

        expect(error.details[0].message).toMatch(/email.*string/);
    });

    it('should return error if email length is shorter than 5', () => {
        user.email = "1234";

        const { error } = validateUser(user);

        expect(error.details[0].message).toMatch(/email.*5/);
    });

    it('should return error if email length is greater than 254', () => {
        user.email = new Array(256).join('a');

        const { error } = validateUser(user);

        expect(error.details[0].message).toMatch(/email.*254/);
    });

    it('should return error if email is not valid', () => {
        user.email = "email";

        const { error } = validateUser(user);

        expect(error.details[0].message).toMatch(/email.*valid/);
    });

    it('should return error if password is not provided', () => {
        delete user.password;

        const { error } = validateUser(user);

        expect(error.details[0].message).toMatch(/password.*required/);
    });

    it('should return error if password is less than 8 characters', () => {
        user.password = "abcdE1$";

        const { error } = validateUser(user);

        expect(error.details[0].message).toMatch(/password.*8/);
    });

    it('should return error if password is greater than 8 characters', () => {
        user.password = (new Array(25).join('a')) + "B1$";

        const { error } = validateUser(user);

        expect(error.details[0].message).toMatch(/password.*26/);
    });

    it('should return error if password does not contain a lowercase letter', () => {
        user.password = "ABCDEF1$";

        const { error } = validateUser(user);

        expect(error.details[0].message).toMatch(/password.*lower/);
    });

    it('should return error if password does not contain an uppercase letter', () => {
        user.password = "abcdef1$";

        const { error } = validateUser(user);

        expect(error.details[0].message).toMatch(/password.*upper/);
    });

    it('should return error if password does not contain a number', () => {
        user.password = "abcdefG$";

        const { error } = validateUser(user);

        expect(error.details[0].message).toMatch(/password.*number/);
    });

    it('should return error if password does not contain a symbol', () => {
        user.password = "abcdefG1";

        const { error } = validateUser(user);

        expect(error.details[0].message).toMatch(/password.*symbol/);
    });

    it('should not return error if email is valid', () => {
        const { error } = validateUser(user);

        expect(error).not.toBeDefined();
    });
});
