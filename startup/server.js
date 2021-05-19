const winston = require('winston');

module.exports = async function(app) {
    const port = process.env.PORT || 3000;
    const server = await app.listen(port);

    winston.info(`Listening on port ${port}...`);
    
    return server;
};