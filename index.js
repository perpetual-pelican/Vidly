require('./startup/logging');
require('./startup/config');
require('./startup/app');
const connectToDB = require('./startup/db');
const startServer = require('./startup/server');

async function main() {
    await connectToDB();
    startServer();
}

main();