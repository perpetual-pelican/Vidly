const mongoose = require('mongoose');
const config = require('config');
const remove = require('../../../middleware/remove');

describe('remove middleware', () => {
    let Model;
    let doc;
    let req;
    let res;
    let next;

    beforeAll(async () => {
        await mongoose.connect(config.get('db') + '_remove', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        Model = mongoose.model('Model', new mongoose.Schema({ name: String }));
    });

    beforeEach(async () => {
        doc = await new Model({ name: 'Model Name' }).save();
        req = { params: { id: doc._id } };
        res = { status: jest.fn().mockReturnValue({ send: jest.fn() }) };
        next = jest.fn();
    });

    afterAll(async () => {
        await mongoose.connection.db.dropDatabase();
        await mongoose.disconnect();
    });

    it('should set status to 404 if id is not found', async () => {
        req.params.id = mongoose.Types.ObjectId();

        await remove(Model)(req, res, next);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should populate req.doc with the deleted document', async () => {
        await remove(Model)(req, res, next);

        expect(req).toHaveProperty('doc');
    });

    it('should delete the document from the database', async () => {
        await remove(Model)(req, res, next);

        const docInDB = await Model.findById(doc._id);

        expect(docInDB).toBeNull();
    });

    it('should call next if document is found', async () => {
        await remove(Model)(req, res, next);

        expect(next).toHaveBeenCalled();
    });
});
