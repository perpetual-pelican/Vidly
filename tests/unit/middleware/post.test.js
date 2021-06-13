const mongoose = require('mongoose');
const db = require('../../../startup/config').db;
const post = require('../../../middleware/post');

describe('post middleware', () => {
    let Model;
    let req;
    let res;
    let next;

    beforeAll(async () => {
        await mongoose.connect(db + '_post', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        Model = mongoose.model('Model', new mongoose.Schema({ name: String }));
    });

    beforeEach(async () => {
        req = { body: { name: 'Model Name' } };
        res = {};
        next = jest.fn();
    });

    afterAll(async () => {
        await mongoose.connection.db.dropDatabase();
        await mongoose.disconnect();
    });

    it('should populate req.doc with the created document', async () => {
        await post(Model)(req, res, next);

        expect(req).toHaveProperty('doc');
    });

    it('should save the document to the database', async () => {
        await post(Model)(req, res, next);

        const docInDB = await Model.findOne(req.body);

        expect(docInDB).toMatchObject(req.body);
    });

    it('should call next if document is found', async () => {
        await post(Model)(req, res, next);

        expect(next).toHaveBeenCalled();
    });
});
