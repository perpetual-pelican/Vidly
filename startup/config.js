const config = require('config');

if (!config.get('jwtPrivateKey'))
    throw new Error('FATAL ERROR: vidly_jwtPrivateKey is not defined.');

const dbString = 'mongodb://localhost/vidly';

module.exports = { db: `${dbString}_${process.env.NODE_ENV || 'development'}` };