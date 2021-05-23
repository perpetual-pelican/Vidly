# Vidly
Node-based video rental processing service using MongoDB/Mongoose and Express
 - based on The Complete Node.js Course by Mosh Hamedani.
 - project is still unfinished and has no front-end, but I plan to work on that in the future

To Install:
1. Clone the repository
2. Open a terminal in the repository directory
3. Run `npm ci` to install all dependencies
4. Run `npm test` to run all tests. They should all pass if the project has been installed successfully

To Run:
1. Set an environment variable `vidly_jwtPrivateKey` using the private key string of your choice
2. If you wish, set `PORT` to specify a port for the server, otherwise port 3000 will be used
3. Run `node index.js` to start the server

Two info messages should be displayed, indicating successful database connection and server startup

To connect to the server:
1. Open a browser or service like Postman
2. Enter the url `localhost:[PORT_NUMBER]` to access the home page

Here, you should see `Home Page` displayed in plain text, indicating a 200 response from the server
 - beyond this, it is best to use something like Postman to test http requests on the various routes available
 
The structure of the url routes is as follows:

    localhost:[PORT_NUMBER]
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

By default, the MongoDB data is stored locally in ProgramFiles under MongoDB on Windows or in /data/db on Mac and Linux
