const config = require('config');
const hostname = require('os').hostname();

if (!config.get('jwtPrivateKey'))
    throw new Error('FATAL ERROR: vidly_jwtPrivateKey is not defined.');

const dbString =
    `mongodb://${hostname}:27017,${hostname}:27018,${hostname}:27019/vidly`;

module.exports = { db: `${dbString}_${process.env.NODE_ENV || 'development'}` };