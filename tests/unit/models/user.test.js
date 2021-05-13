const config = require('config');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { User } = require('../../../models/user');

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