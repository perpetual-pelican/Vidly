const request = require('supertest');
const test = require('../../../testSetup');
const app = require('../../../startup/app');
const { User } = require('../../../models/user');
const { Genre } = require('../../../models/genre');

describe('/api/genres', () => {
    let genreObject;

    test.setup('genres');

    beforeEach(() => {
        genreObject = { name: 'Genre Name' };
    });

    describe('GET /', () => {
        let genres;

        beforeEach(async () => {
            genres = [
                await new Genre(genreObject).save(),
                await new Genre({ name: 'Genre Name 2' }).save()
            ];
        });

        const getGenres = () => {
            return request(app).get('/api/genres');
        };
    
        it('should return all genres', async () => {
            const res = await getGenres();

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            for (const genre of genres)
                expect(res.body.some(g => g.name === genre.name)).toBe(true);
        });
    });

    describe('GET /:id', () => {
        let genre;
        let id;

        beforeEach(async () => {
            genre = await new Genre(genreObject).save();
            id = genre._id;
        });

        const getGenre = (req) => {
            return request(app).get('/api/genres/' + req.id);
        };

        it('should return 404 if id is invalid', async () => {
            await test.idInvalid(getGenre);
        });

        it('should return 404 if id is not found', async () => {
            await test.idNotFound(getGenre);
        });

        it('should return the genre if id is found', async () => {
            const res = await getGenre({ id });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', genre.name);
        });
    });

    describe('POST /', () => {
        let token;

        beforeEach(() => {
            token = new User().generateAuthToken();
        });

        const postGenre = (req) => {
            if (!req.body)
                req.body = genreObject;
            return request(app)
                .post('/api/genres')
                .set('x-auth-token', req.token)
                .send(req.body);
        };

        it('should return 401 if client is not logged in', async () => {
            await test.tokenEmpty(postGenre);
        });

        it('should return 400 if token is invalid', async () => {
            await test.tokenInvalid(postGenre);
        });

        it('should return 400 if invalid property is added', async () => {
            await test.requestInvalid(postGenre, genreObject, token);
        });

        it('should return 400 if genre name already exists', async () => {
            await Genre.create(genreObject);

            const res = await postGenre({ token });

            expect(res.status).toBe(400);
            expect(res.text).toMatch(/[Nn]ame.*[Ee]xists/);
        });

        it('should save the genre if request is valid', async () => {
            await postGenre({ token });
            
            const genreInDB = await Genre.findOne(genreObject);

            expect(genreInDB).toHaveProperty('name', genreObject.name);
        });

        it('should return the genre if request is valid', async () => {
            const res = await postGenre({ token });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', genreObject.name);
        });
    });

    describe('PUT /:id', () => {
        let token;
        let genre;
        let id;
        let genreUpdate;

        beforeEach(async () => {
            token = new User().generateAuthToken();
            genre = await new Genre(genreObject).save();
            id = genre._id;
            genreUpdate = { name: 'Updated Genre Name' };
        });

        const putGenre = (req) => {
            if (!req.body)
                req.body = genreUpdate;
            return request(app)
                .put('/api/genres/' + req.id)
                .set('x-auth-token', req.token)
                .send(req.body);
        };

        it('should return 401 if client is not logged in', async () => {
            await test.tokenEmpty(putGenre, id);
        });

        it('should return 400 if token is invalid', async () => {
            await test.tokenInvalid(putGenre, id);
        });

        it('should return 404 if id is invalid', async () => {
            await test.idInvalid(putGenre, token);
        });

        it('should return 404 if id is not found', async () => {
            await test.idNotFound(putGenre, token);
        });

        it('should return 400 if invalid property is added', async () => {
            await test.requestInvalid(putGenre, genreUpdate, token, id);
        });

        it('should return 400 if genre name already exists', async () => {
            genreUpdate.name = genre.name;

            const res = await putGenre({ token, id });

            expect(res.status).toBe(400);
            expect(res.text).toMatch(/[Nn]ame.*[Ee]xists/);
        });

        it('should update the genre if request is valid', async () => {
            await putGenre({ token, id });
            
            const genreInDB = await Genre.findOne(genreUpdate);

            expect(genreInDB).toHaveProperty('name', genreUpdate.name);
        });

        it('should return the updated genre if request is valid', async () => {
            const res = await putGenre({ token, id });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', genreUpdate.name);
        });
    });

    describe('DELETE /:id', () => {
        let token;
        let genre;
        let id;

        beforeEach(async () => {
            token = new User({ isAdmin: true }).generateAuthToken();
            genre = await new Genre(genreObject).save();
            id = genre._id;
        });

        const deleteGenre = (req) => {
            return request(app)
                .delete('/api/genres/' + req.id)
                .set('x-auth-token', req.token);
        };

        it('should return 401 if client is not logged in', async () => {
            await test.tokenEmpty(deleteGenre, id);
        });
        
        it('should return 400 if token is invalid', async () => {
            await test.tokenInvalid(deleteGenre, id);
        });
        
        it('should return 403 if client is not an admin', async () => {
            token = new User({ isAdmin: false }).generateAuthToken();

            await test.adminFalse(deleteGenre, token, id);
        });

        it('should return 404 if id is invalid', async () => {
            await test.idInvalid(deleteGenre, token);
        });

        it('should return 404 if id is not found', async () => {
            await test.idNotFound(deleteGenre, token);
        });

        it('should delete the genre if request is valid', async () => {
            await deleteGenre({ token, id });
            
            const genreInDB = await Genre.findById(genre._id);

            expect(genreInDB).toBeNull();
        });

        it('should return the deleted genre if request is valid', async () => {
            const res = await deleteGenre({ token, id });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', genre.name);
        });
    });
});
