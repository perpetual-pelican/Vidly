const test = require('../../testSetup');
const app = require('../../startup/app');
const { User } = require('../../models/user');
const { Genre } = require('../../models/genre');

const { getAll, getOne, post, put, del } = test.request;

describe('/api/genres', () => {
    let genreObject;
    let req;

    test.setup('genres', app);

    beforeEach(() => {
        genreObject = { name: 'Genre Name' };
    });

    describe('GET /', () => {
        const find = Genre.find;
        let genres;

        beforeEach(async () => {
            genres = [
                await new Genre(genreObject).save(),
                await new Genre({ name: 'Genre Name 2' }).save()
            ];
        });

        afterEach(() => {
            Genre.find = find;
        });

        it('should return 500 if an uncaughtException is encountered', async () => {
            Genre.find = jest.fn(() => { throw new Error('fake uncaught exception'); });

            const res = await getAll();

            expect(res.status).toBe(500);
            expect(res.text).toMatch(/Something failed/);
        });
    
        it('should return all genres', async () => {
            const res = await getAll();

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            for (const genre of genres)
                expect(res.body.some(g => g.name === genre.name)).toBe(true);
        });
    });

    describe('GET /:id', () => {
        let genre;

        beforeEach(async () => {
            genre = await new Genre(genreObject).save();
            req = { id: genre._id };
        });

        it('should return 404 if id is invalid', async () => {
            await test.idInvalid(getOne, req);
        });

        it('should return 404 if id is not found', async () => {
            await test.idNotFound(getOne, req);
        });

        it('should return the genre if id is found', async () => {
            const res = await getOne(req);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', genre.name);
        });
    });

    describe('POST /', () => {
        beforeEach(() => {
            req = {
                token: new User({ isAdmin: false }).generateAuthToken(),
                body: genreObject
            };
        });

        it('should return 401 if client is not logged in', async () => {
            await test.tokenEmpty(post, req);
        });

        it('should return 400 if token is invalid', async () => {
            await test.tokenInvalid(post, req);
        });

        it('should return 400 if invalid property is added', async () => {
            await test.requestInvalid(post, req);
        });

        it('should return 400 if genre name already exists', async () => {
            await Genre.create(genreObject);

            const res = await post(req);

            expect(res.status).toBe(400);
            expect(res.text).toMatch(/[Nn]ame.*[Ee]xists/);
        });

        it('should save the genre if request is valid', async () => {
            await post(req);
            
            const genreInDB = await Genre.findOne(genreObject);

            expect(genreInDB).toHaveProperty('name', genreObject.name);
        });

        it('should return the genre if request is valid', async () => {
            const res = await post(req);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', genreObject.name);
        });
    });

    describe('PUT /:id', () => {
        let genre;
        let genreUpdate;

        beforeEach(async () => {
            genre = await new Genre(genreObject).save();
            genreUpdate = { name: 'Updated Genre Name' };
            req = {
                token: new User().generateAuthToken(),
                id: genre._id,
                body: genreUpdate
            };
        });

        it('should return 401 if client is not logged in', async () => {
            await test.tokenEmpty(put, req);
        });

        it('should return 400 if token is invalid', async () => {
            await test.tokenInvalid(put, req);
        });

        it('should return 404 if id is invalid', async () => {
            await test.idInvalid(put, req);
        });

        it('should return 404 if id is not found', async () => {
            await test.idNotFound(put, req);
        });

        it('should return 400 if invalid property is added', async () => {
            await test.requestInvalid(put, req);
        });

        it('should return 400 if genre name already exists', async () => {
            req.body.name = genre.name;

            const res = await put(req);

            expect(res.status).toBe(400);
            expect(res.text).toMatch(/[Nn]ame.*[Ee]xists/);
        });

        it('should update the genre if request is valid', async () => {
            await put(req);
            
            const genreInDB = await Genre.findOne(genreUpdate);

            expect(genreInDB).toHaveProperty('name', genreUpdate.name);
        });

        it('should return the updated genre if request is valid', async () => {
            const res = await put(req);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', genreUpdate.name);
        });
    });

    describe('DELETE /:id', () => {
        let genre;

        beforeEach(async () => {
            genre = await new Genre(genreObject).save();
            req = {
                token: new User({ isAdmin: true }).generateAuthToken(),
                id: genre._id
            };
        });

        it('should return 401 if client is not logged in', async () => {
            await test.tokenEmpty(del, req);
        });
        
        it('should return 400 if token is invalid', async () => {
            await test.tokenInvalid(del, req);
        });
        
        it('should return 403 if client is not an admin', async () => {
            req.token = new User({ isAdmin: false }).generateAuthToken();

            await test.adminFalse(del, req);
        });

        it('should return 404 if id is invalid', async () => {
            await test.idInvalid(del, req);
        });

        it('should return 404 if id is not found', async () => {
            await test.idNotFound(del, req);
        });

        it('should delete the genre if request is valid', async () => {
            await del(req);
            
            const genreInDB = await Genre.findById(genre._id);

            expect(genreInDB).toBeNull();
        });

        it('should return the deleted genre if request is valid', async () => {
            const res = await del(req);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', genre.name);
        });
    });
});
