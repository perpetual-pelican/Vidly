const express = require('express');

const app = express();

async function main() {
    require('./startup/logging')();
    require('./startup/routes')(app);
    await require('./startup/db')();
    require('./startup/config')();
    require('./startup/validation')();
    return require('./startup/server')(app);
}

module.exports = main();