const winston = require('winston');

module.exports = function(app) {
    const port = process.env.PORT || 3000;
    return app.listen(port, () => winston.info(`Listening on port ${port}...`));
};