const request = require('supertest');
const mongoose = require('mongoose');
const test = require('../../testSetup');
const app = require('../../startup/app');
const { User } = require('../../models/user');
const { Genre } = require('../../models/genre');
const { Movie } = require('../../models/movie');

describe('/api/movies', () => {
    let genres;
    let movieObject;

    test.setup('movies');

    beforeEach(async () => {
        genres = [
            await new Genre({ name: 'Genre Name' }).save(),
            await new Genre({ name: 'Genre Name 2' }).save()
        ];
        movieObject =  {
            title: 'Movie Title',
            dailyRentalRate: 1,
            numberInStock: 1,
            genres: [genres[0]]
        };
    });

    describe('GET /', () => {
        let movies;

        beforeEach(async () => {
            movies = [
                await new Movie(movieObject).save(),
                await new Movie({
                    title: ' Movie Title 2',
                    dailyRentalRate: 2,
                    numberInStock: 2,
                    genres: [genres[1]]
                }).save()
            ];
        });

        const getMovies = () => {
            return request(app).get('/api/movies');
        };

        it('should return all movies', async () => {
            const res = await getMovies();

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(m =>
                m.title === movies[0].title &&
                m.dailyRentalRate === movies[0].dailyRentalRate &&
                m.numberInStock === movies[0].numberInStock &&
                m.genres[0].name === movies[0].genres[0].name
            )).toBe(true);
            expect(res.body.some(m =>
                m.title === movies[1].title &&
                m.dailyRentalRate === movies[1].dailyRentalRate &&
                m.numberInStock === movies[1].numberInStock &&
                m.genres.some(g => g.name === movies[1].genres[0].name)
            )).toBe(true);
        });
    });

    describe('GET /:id', () => {
        let movie;
        let id;

        beforeEach(async () => {
            movie = await new Movie(movieObject).save();
            id = movie._id;
        });

        const getMovie = (req) => {
            return request(app).get('/api/movies/' + req.id);
        };

        it('should return 404 if id is invalid', async () => {
            await test.idInvalid(getMovie);
        });

        it('should return 404 if id is not found', async () => {
            await test.idNotFound(getMovie);
        });

        it('should return the movie if request is valid', async () => {
            const res = await getMovie({ id });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('title', movie.title);
            expect(res.body).toHaveProperty('dailyRentalRate', movie.dailyRentalRate);
            expect(res.body).toHaveProperty('numberInStock', movie.numberInStock);
            expect(res.body).toHaveProperty('genres', expect.arrayContaining([
                expect.objectContaining({ name: movie.genres[0].name })
            ]));
        });
    });

    describe('POST /', () => {
        let token;

        beforeEach(async () => {
            token = new User().generateAuthToken();
            delete movieObject.genres;
            movieObject.genreIds = [genres[0]._id];
        });

        const postMovie = (req) => {
            if (!req.body)
                req.body = movieObject;
            return request(app)
                .post('/api/movies')
                .set('x-auth-token', req.token)
                .send(req.body);
        };

        it('should return 401 if client is not logged in', async () => {
            await test.tokenEmpty(postMovie);
        });

        it('should return 400 if token is invalid', async () => {
            await test.tokenInvalid(postMovie);
        });

        it('should return 400 if request body is invalid', async () => {
            await test.requestInvalid(postMovie, movieObject, token);
        });

        it('should return 400 if any genre id is not found', async () => {
            movieObject.genreIds.push(mongoose.Types.ObjectId().toHexString());

            const res = await postMovie({ token });

            expect(res.status).toBe(400);
            expect(res.text).toMatch(/[Gg]enre.*[Ii]d/);
        });

        it('should return 200 if genreIds is undefined', async () => {
            delete movieObject.genreIds;

            const res = await postMovie({ token });

            expect(res.status).toBe(200);
            expect(res.body).not.toHaveProperty('genres');
        });

        it('should save the movie if request is valid', async () => {
            await postMovie({ token });

            const movieInDB = await Movie.findOne({ title: movieObject.title });

            expect(movieInDB).toHaveProperty('title', movieObject.title);
            expect(movieInDB).toHaveProperty('dailyRentalRate', movieObject.dailyRentalRate);
            expect(movieInDB).toHaveProperty('numberInStock', movieObject.numberInStock);
            expect(movieInDB).toHaveProperty('genres', expect.arrayContaining([
                expect.objectContaining({ name: genres[0].name })
            ]));
        });

        it('should return the movie if request is valid', async () => {
            const res = await postMovie({ token });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('title', movieObject.title);
            expect(res.body).toHaveProperty('dailyRentalRate', movieObject.dailyRentalRate);
            expect(res.body).toHaveProperty('numberInStock', movieObject.numberInStock);
            expect(res.body).toHaveProperty('genres', expect.arrayContaining([
                expect.objectContaining({ name: genres[0].name })
            ]));
        });
    });

    describe('PUT /:id', () => {
        let token;
        let movie;
        let id;
        let movieUpdate;

        beforeEach(async () => {
            token = new User().generateAuthToken();
            movie = await new Movie(movieObject).save();
            id = movie._id;
            movieUpdate = {
                title: 'Updated Movie Title',
                genreIds: [genres[1]._id]
            };
        });

        const putMovie = (req) => {
            if (!req.body)
                req.body = movieUpdate;
            return request(app)
                .put('/api/movies/' + req.id)
                .set('x-auth-token', req.token)
                .send(req.body);
        };

        it('should return 401 if client is not logged in', async () => {
            await test.tokenEmpty(putMovie, id);
        });

        it('should return 400 if token is invalid', async () => {
            await test.tokenInvalid(putMovie, id);
        });

        it('should return 404 if id is invalid', async () => {
            await test.idInvalid(putMovie, token);
        });

        it('should return 404 if id is not found', async () => {
            await test.idNotFound(putMovie, token);
        });

        it('should return 400 if request body is empty', async () => {
            await test.requestEmpty(putMovie, token, id);
        });

        it('should return 400 if request body is invalid', async () => {
            await test.requestInvalid(putMovie, movieUpdate, token, id);
        });

        it('should return 400 if any genreId is not found', async () => {
            movieUpdate.genreIds.push(mongoose.Types.ObjectId().toHexString());

            const res = await putMovie({ token, id });

            expect(res.status).toBe(400);
            expect(res.text).toMatch(/[Gg]enre.*[Ii]d/);
        });

        it('should update the movie if genreIds is undefined', async () => {
            delete movieUpdate.genreIds;

            await putMovie({ token, id });

            const movieInDB = await Movie.findById(movie._id);

            expect(movieInDB).toHaveProperty('title', movieUpdate.title);
            expect(movieInDB).toHaveProperty('dailyRentalRate', movie.dailyRentalRate);
            expect(movieInDB).toHaveProperty('numberInStock', movie.numberInStock);
            expect(movieInDB).toHaveProperty('genres', expect.arrayContaining([
                expect.objectContaining({ name: movie.genres[0].name })
            ]));
        });

        it('should not update genres if genreIds is undefined', async () => {
            delete movieUpdate.genreIds;

            const res = await putMovie({ token, id });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('genres');
            expect(res.body.genres.some(g => g.name === genres[0].name)).toBe(true);
        });

        it('should update movie genres if genreIds are valid', async () => {
            delete movieUpdate.title;

            await putMovie({ token, id });

            const movieInDB = await Movie.findById(movie._id);

            expect(movieInDB).toHaveProperty('title', movie.title);
            expect(movieInDB).toHaveProperty('dailyRentalRate', movie.dailyRentalRate);
            expect(movieInDB).toHaveProperty('numberInStock', movie.numberInStock);
            expect(movieInDB).toHaveProperty('genres', expect.arrayContaining([
                expect.objectContaining({ name: genres[1].name })
            ]));
        });

        it('should return the movie if request is valid', async () => {
            const res = await putMovie({ token, id });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('title', movieUpdate.title);
            expect(res.body).toHaveProperty('dailyRentalRate', movie.dailyRentalRate);
            expect(res.body).toHaveProperty('numberInStock', movie.numberInStock);
            expect(res.body).toHaveProperty('genres', expect.arrayContaining([
                expect.objectContaining({ name: genres[1].name })
            ]));
        });
    });

    describe('DELETE /:id', () => {
        let token;
        let movie;
        let id;

        beforeEach(async () => {
            token = new User({ isAdmin: true }).generateAuthToken();
            movie = await new Movie(movieObject).save();
            id = movie._id;
        });

        const deleteMovie = (req) => {
            return request(app)
                .delete('/api/movies/' + req.id)
                .set('x-auth-token', req.token);
        };

        it('should return 401 if client is not logged in', async () => {
            await test.tokenEmpty(deleteMovie, id);
        });

        it('should return 400 if token is invalid', async () => {
            await test.tokenInvalid(deleteMovie, id);
        });

        it('should return 403 if user is not an admin', async () => {
            token = new User({ isAdmin: false }).generateAuthToken();

            await test.adminFalse(deleteMovie, token, id);
        });

        it('should return 404 if id is invalid', async () => {
            await test.idInvalid(deleteMovie, token);
        });

        it('should return 404 if id is not found', async () => {
            await test.idNotFound(deleteMovie, token);
        });

        it('should delete the movie if request is valid', async () => {
            await deleteMovie({ token, id });

            const movieInDB = await Movie.findById(id);

            expect(movieInDB).toBeNull();
        });

        it('should return the movie if request is valid', async () => {
            const res = await deleteMovie({ token, id });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('title', movie.title);
            expect(res.body).toHaveProperty('dailyRentalRate', movie.dailyRentalRate);
            expect(res.body).toHaveProperty('numberInStock', movie.numberInStock);
            expect(res.body).toHaveProperty('genres', expect.arrayContaining([
                expect.objectContaining({ name: movie.genres[0].name })
            ]));
        });
    });
});
