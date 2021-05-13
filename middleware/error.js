const { loggers } = require('winston');

module.exports = function(err, req, res, next) {
    loggers.get('console').error(err.message, err);
    loggers.get('file').error(err.message, err);
    loggers.get('db').error(err.message, { metadata: { error: err } });
    
    res.status(500).send('Something failed');
};