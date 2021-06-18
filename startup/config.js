const config = require('config');
const os = require('os');

if (!config.get('jwtPrivateKey'))
  throw new Error('FATAL ERROR: vidly_jwtPrivateKey is not defined.');

const host = os.type() === 'Windows_NT' ? os.hostname() : 'localhost';
const dbStringBase = `mongodb://${host}:27017,${host}:27018,${host}:27019/vidly`;
const env = process.env.NODE_ENV || 'development';

module.exports = {
  dbString: `${dbStringBase}_${env}`,
  dbOptions: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  }
};
