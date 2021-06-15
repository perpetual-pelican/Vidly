# Vidly
Node-based video rental processing app using MongoDB/Mongoose and Express
 - based on The Complete Node.js Course by Mosh Hamedani
 - project has no front-end, but I plan to work on that in the future

## Setup

### Install MongoDB
 - https://docs.mongodb.com/manual/installation/
 - By default, the MongoDB data is stored locally
   - in ProgramFiles under MongoDB on Windows
   - in /var/lib/mongodb on Linux
   - in /etc/mongo/data/db on Mac ( or /usr/local/var/mongodb using homebrew)

### Install Dependencies
1. Clone the repository
2. Open a terminal in the repository directory
3. Run `npm ci` to install all dependencies

### Start DB
 - In a new terminal, use the command `npm run db` to start the database
 - A few messages will be displayed, indicating that a replica set is being started
 - After several seconds, the database will be ready when it says "Connected to oplog"

### Run Tests
 - With the database running, go back to the first terminal and use `npm test` to run all tests
 - They should all pass if the project has been set up successfully

### Prepare Environment Variables
 - Set `vidly_jwtPrivateKey` using a private key of your choice. This is used for authentication
 - If you wish, set `PORT` to specify a port for the server, otherwise port 3000 will be used

### Start Server
 - In the same terminal used to run the tests, use `npm start` to run the server
 - Two info messages should be displayed, indicating successful database connection and server startup

### View Home Page
 - Open http://localhost:3000 or `http://localhost:[PORT]` in a browser
 - Here, you should see `Home Page` displayed in plain text, indicating a successful response from the server
   - beyond this, it is best to use something like Postman to test http requests on the various routes available
 
### URL Route Structure
    http://localhost:[PORT]/
      api/
        auth
        users/
          me
        customers/
          customerId
        genres/
          genreId
        movies/
          movieId
        rentals/
          rentalId
        returns
