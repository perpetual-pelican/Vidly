/* istanbul ignore file */

const mongoose = require('mongoose');
const config = require('config');

module.exports.setup = function(databaseName) {
    beforeAll(async () => {
        await mongoose.connect(config.get('db') + '_' + databaseName, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true });
    });

    afterEach(async () => {
        for (const collectionName of Object.keys(mongoose.connection.collections))
            await mongoose.connection.collections[collectionName].deleteMany();
    });

    afterAll(async () => {
        await mongoose.connection.db.dropDatabase();
        await mongoose.disconnect();
    });
};

module.exports.tokenEmpty = async function(request, id) {
    const token = '';

    const res = await request({ token, id });

    expect(res.status).toBe(401);
    expect(res.text).toMatch(/[Dd]enied/);
};

module.exports.tokenInvalid = async function(request, id) {
    const token = 'invalid';

    const res = await request({ token, id });

    expect(res.status).toBe(400);
    expect(res.text).toMatch(/[Ii]nvalid.*[Tt]oken/);
};

module.exports.idInvalid = async function(request, token) {
    const id = 'invalid';

    const res = await request({ token, id });

    expect(res.status).toBe(404);
    expect(res.text).toMatch(/[Ii]nvalid.*[Ii][Dd]/);
};

module.exports.idNotFound = async function(request, token) {
    const id = mongoose.Types.ObjectId().toHexString();

    const res = await request({ token, id });

    expect(res.status).toBe(404);
    expect(res.text).toMatch(/[Ii][Dd].*[Nn]ot.*[Ff]ound/);
};

module.exports.requestEmpty = async function(request, token, id) {
    const body = {};

    const res = await request({ token, id, body });

    expect(res.status).toBe(400);
    expect(res.text).toMatch(/[Pp]roperty.*[Rr]equired/);
};

module.exports.requestInvalid = async function(request, body, token, id) {
    if (body) {
        body.invalidProperty = 'invalid';
    } else {
        body = { invalidProperty: 'invalid' };
    }

    const res = await request({ token, body, id });

    expect(res.status).toBe(400);
    expect(res.text).toMatch(/[Nn]ot.*[Aa]llowed/);
};

module.exports.adminFalse = async function(request, token, id) {
    const res = await request({ token, id });

    expect(res.status).toBe(403);
    expect(res.text).toMatch(/[Dd]enied/);
};