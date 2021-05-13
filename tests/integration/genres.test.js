const request = require('supertest');
const { Genre } = require('../../models/genre');
const { User } = require('../../models/user');

let server;

describe('/api/genres', () => {
    beforeEach(async () => { server = await require('../../index'); });
    afterEach(async () => {
        await Genre.deleteMany({});
        await server.close();
    });

    describe('GET /', () => {
        it('should return all genres', async () => {
            await Genre.insertMany([
                { name: 'genre1' },
                { name: 'genre2' }
            ]);

            const res = await request(server).get('/api/genres');

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
            expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();
        });
    });

    describe('GET /:name', () => {
        it('should return a genre if the given name is valid', async () => {
            await Genre.create({ name: 'genre1' });

            const res = await request(server).get('/api/genres/genre1');

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', 'genre1');
        });
        it('should return 404 if the given name is invalid', async () => {
            const res = await request(server).get('/api/genres/genre1');

            expect(res.status).toBe(404);
        });
    });

    describe('POST /', () => {
        let token;
        let name;

        const exec = () => {
            return request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send(name ? { name } : {});
        };

        beforeEach(() => {
            token = new User().generateAuthToken();
            name = 'genre1';
        });

        it('should return 401 if client is not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });
        it('should return 400 if genre name is not provided', async () => {
            name = '';

            const res = await exec();

            expect(res.status).toBe(400);
        });
        it('should return 400 if genre is less than 3 characters', async () => {
            name = '12';

            const res = await exec();

            expect(res.status).toBe(400);
        });
        it('should return 400 if genre is more than 128 characters', async () => {
            name = new Array(130).join('a');

            const res = await exec();

            expect(res.status).toBe(400);
        });
        it('should return 400 if genre already exists', async () => {
            await Genre.create({ name });

            const res = await exec();

            expect(res.status).toBe(400);
        });
        it('should save the genre if it is valid', async () => {
            await exec();
            
            const genre = Genre.find({ name });

            expect(genre).not.toBeNull();
        });
        it('should return the genre if it is valid', async () => {
            const res = await exec();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', name);
        });
    });

    describe('PUT /:name', () => {
        let token;
        let oldName;
        let newName;

        const exec = () => {
            return request(server)
                .put('/api/genres/' + oldName)
                .set('x-auth-token', token)
                .send(newName ? { name: newName } : {});
        };

        beforeEach(async () => {
            await Genre.create({ name: 'genre1'});
            token = new User().generateAuthToken();
            oldName = 'genre1';
            newName = 'genre2';
        });

        it('should return 401 if client is not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });
        it('should return 404 if the given genre does not exist', async () => {
            oldName = 'genre';

            const res = await exec();

            expect(res.status).toBe(404);
        });
        it('should return 400 if genre name is not provided', async () => {
            newName = '';

            const res = await exec();

            expect(res.status).toBe(400);
        });
        it('should return 400 if genre is less than 3 characters', async () => {
            newName = '12';

            const res = await exec();

            expect(res.status).toBe(400);
        });
        it('should return 400 if genre is more than 128 characters', async () => {
            newName = new Array(130).join('a');

            const res = await exec();

            expect(res.status).toBe(400);
        });
        it('should return 400 if genre already exists', async () => {
            newName = 'genre1';

            const res = await exec();

            expect(res.status).toBe(400);
        });
        it('should update the genre if input is valid', async () => {
            await exec();
            
            const genre = Genre.find({ newName });

            expect(genre).not.toBeNull();
        });
        it('should return the updated genre if it is valid', async () => {
            const res = await exec();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', newName);
        });
    });

    describe('DELETE /:name', () => {
        let token;
        let name;

        const exec = () => {
            return request(server)
                .delete('/api/genres/' + name)
                .set('x-auth-token', token);
        };

        beforeEach(async () => {
            await Genre.create({ name: 'genre1'});
            token = new User({ isAdmin: true }).generateAuthToken();
            name = 'genre1';
        });

        it('should return 401 if client is not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });
        it('should return 403 if client is not admin', async () => {
            token = new User({ isAdmin: false }).generateAuthToken();

            const res = await exec();

            expect(res.status).toBe(403);
        });
        it('should return 404 if the given genre does not exist', async () => {
            name = 'genre';

            const res = await exec();

            expect(res.status).toBe(404);
        });
        it('should delete the genre if input is valid', async () => {
            await exec();
            
            const genre = await Genre.findOne({ name });

            expect(genre).toBeNull();
        });
        it('should return the deleted genre if input is valid', async () => {
            const res = await exec();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', name);
        });
    });
});