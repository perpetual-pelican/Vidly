# Vidly
Node-based video rental processing app using MongoDB/Mongoose and Express
 - based on The Complete Node.js Course by Mosh Hamedani.
 - project is still unfinished and has no front-end, but I plan to work on that in the future

## Setup

### Install MongoDB
 - https://docs.mongodb.com/manual/installation/
 - By default, the MongoDB data is stored locally
   - in ProgramFiles under MongoDB on Windows
   - in /var/lib/mongodb on Linux
   - in /etc/mongo/data/db on Mac ( or /usr/local/var/mongodb using homebrew)

### Install Dependencies
1. Open a terminal in the repository directory
2. Run `npm ci` to install all dependencies

### Run Tests
 - Use `npm test` to run all tests. They should all pass if the project has been set up successfully

### Prepare Environment Variables
1. set `vidly_jwtPrivateKey` using a private key of your choice
2. If you wish, set `PORT` to specify a port for the server, otherwise port 3000 will be used

### Start Server
 - Run `node index.js`
 - Two info messages should be displayed, indicating successful database connection and server startup

### View the Home Page
 - Open http://localhost:3000 or `http://localhost:[YOUR_PORT_NUMBER]` in a browser
 - Here, you should see `Home Page` displayed in plain text, indicating a 200 response from the server
   - beyond this, it is best to use something like Postman to test http requests on the various routes available
 
### URL Route Structure
    http://localhost:[PORT_NUMBER]
      /api/auth
      /api/users
        /me
      /api/customers
        /customerId
      /api/genres
        /genreId
      /api/movies
        /movieId
      /api/rentals
        /rentalId
      /api/returns
