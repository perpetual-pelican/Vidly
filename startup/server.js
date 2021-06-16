const winston = require('winston');
const app = require('./app');

module.exports = function () {
  const port = process.env.PORT || 3000;
  const server = app.listen(port);

  winston.info(`Listening on port ${port}...`);

  return server;
};
