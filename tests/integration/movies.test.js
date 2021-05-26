const request = require('supertest');
const mongoose = require('mongoose');
const { Movie } = require('../../models/movie');
const { Genre } = require('../../models/genre');
const { User } = require('../../models/user');

describe('/api/movies', () => {
    let server;
    let genre;

    beforeEach(async () => { server = await require('../../index'); });

    afterEach(async () => {
        await Genre.deleteMany();
        await Movie.deleteMany();
        await server.close();
    });

    describe('GET /', () => {
        it('should return all movies', async () => {
            genre = new Genre({ name: 'genre' });
            await genre.save();

            await Movie.insertMany([
                { title: 'movie1', genres: [genre], numberInStock: 1, dailyRentalRate: 1 },
                { title: 'movie2', genres: [genre], numberInStock: 1, dailyRentalRate: 1 }
            ]);

            const res = await request(server).get('/api/movies');

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(m => m.title === 'movie1')).toBeTruthy();
            expect(res.body.some(m => m.title === 'movie2')).toBeTruthy();
        });
    });

    describe('GET /:id', () => {
        it('should return 404 if id is invalid', async () => {
            const res = await request(server).get('/api/movies/invalid_id');

            expect(res.status).toBe(404);
        });

        it('should return 404 if id is not found', async () => {
            const id = mongoose.Types.ObjectId().toHexString();

            const res = await request(server).get('/api/movies/' + id);

            expect(res.status).toBe(404);
        });

        it('should return 200 if request is valid', async () => {
            genre = new Genre({ name: 'genre' });
            await genre.save();

            let movie = new Movie({
                title: 'movie',
                genres: [genre],
                numberInStock: 1,
                dailyRentalRate: 1
            });
            await movie.save();

            const res = await request(server).get('/api/movies/' + movie._id);

            expect(res.status).toBe(200);
        });
    });

    describe('POST /', () => {
        let token;
        let movie;

        beforeEach(async () => {
            token = new User().generateAuthToken();

            genre = new Genre({ name: 'genre' });
            await genre.save();

            movie = {
                title: 'movie',
                genreIds: [genre._id],
                numberInStock: 1,
                dailyRentalRate: 1
            };
        });

        const exec = () => {
            return request(server)
                .post('/api/movies')
                .set('x-auth-token', token)
                .send(movie);
        };

        it('should return 401 if client not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 400 if invalid token provided', async () => {
            token = 'invalid token';

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if request is invalid', async () => {
            delete movie.title;

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if genreId is not found', async () => {
            movie.genreIds = [mongoose.Types.ObjectId().toHexString()];

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should save the movie if request is valid', async () => {
            await exec();

            const movieInDB = await Movie.findOne({ title: movie.title });

            expect(movieInDB).toHaveProperty('title', movie.title);
        });

        it('should return the movie if request is valid', async () => {
            const res = await exec();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('title', movie.title);
        });
    });

    describe('PUT /:id', () => {
        let token;
        let oldMovie;
        let newMovie;
        let id;

        beforeEach(async () => {
            token = new User().generateAuthToken();

            genre = new Genre({ name: 'genre' });
            await genre.save();

            newMovie = {
                title: 'movie1',
                genreIds: [genre._id],
                numberInStock: 1,
                dailyRentalRate: 1
            };

            oldMovie = new Movie(newMovie);
            await oldMovie.save();
            id = oldMovie._id;

            newMovie.title = 'movie2';
        });

        const exec = () => {
            return request(server)
                .put('/api/movies/' + id)
                .set('x-auth-token', token)
                .send(newMovie);
        };

        it('should return 401 if client not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 400 if invalid token provided', async () => {
            token = 'invalid token';

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 404 if id is invalid', async () => {
            id = 'invalid id';

            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 404 if id is not found', async () => {
            id = mongoose.Types.ObjectId().toHexString();

            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 400 if request is empty', async () => {
            newMovie = {};

            const res = await exec();

            expect(res.status).toBe(400);
            expect(res.text).toMatch(/required/);
        });

        it('should return 400 if request is invalid', async () => {
            newMovie.genreIds = [];

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if genreId is not found', async () => {
            newMovie.genreIds = [mongoose.Types.ObjectId().toHexString()];

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should save the movie if request is valid', async () => {
            await exec();

            const movieInDB = await Movie.findOne({ title: newMovie.title });

            expect(movieInDB).not.toBeNull();
        });

        it('should return the movie if request is valid', async () => {
            const res = await exec();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('title', newMovie.title);
        });
    });

    describe('DELETE /:id', () => {
        let token;
        let movie;
        let id;

        beforeEach(async () => {
            token = new User({ isAdmin: true }).generateAuthToken();

            genre = new Genre({ name: 'genre' });
            await genre.save();

            movie = new Movie({
                title: 'movie1',
                genreIds: [genre._id],
                numberInStock: 1,
                dailyRentalRate: 1
            });
            await movie.save();
            id = movie._id;
        });

        const exec = () => {
            return request(server)
                .delete('/api/movies/' + id)
                .set('x-auth-token', token);
        };

        it('should return 401 if client not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 400 if invalid token provided', async () => {
            token = 'invalid token';

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 403 if user is not an admin', async () => {
            token = new User({ isAdmin: false }).generateAuthToken();

            const res = await exec();

            expect(res.status).toBe(403);
        });

        it('should return 404 if id is invalid', async () => {
            id = 'invalid id';

            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 404 if id is not found', async () => {
            id = mongoose.Types.ObjectId().toHexString();

            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should delete the movie if request is valid', async () => {
            await exec();

            const movieInDB = await Movie.findById(id);

            expect(movieInDB).toBeNull();
        });

        it('should return the movie if request is valid', async () => {
            const res = await exec();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('title', movie.title);
        });
    });
});
