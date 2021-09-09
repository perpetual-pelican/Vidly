require('./src/startup/config');
require('./src/startup/logging');
require('./src/startup/app');
const connectToDB = require('./src/startup/db');
const startServer = require('./src/startup/server');

async function main() {
  await connectToDB();
  startServer();
}

main();
