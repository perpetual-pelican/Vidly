const mongoose = require('mongoose');
const db = require('../../../startup/config').db;
const put = require('../../../middleware/put');

describe('put middleware', () => {
  let Model;
  let doc;
  let req;
  let res;
  let next;

  beforeAll(async () => {
    await mongoose.connect(db + '_put', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    });
    Model = mongoose.model('Model', new mongoose.Schema({ name: String }));
  });

  beforeEach(async () => {
    doc = await new Model({ name: 'Model Name' }).save();
    req = { body: { name: 'Updated Model Name' }, doc };
    res = { status: jest.fn().mockReturnValue({ send: jest.fn() }) };
    next = jest.fn();
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  it('should populate req.doc with the updated document', async () => {
    await put(req, res, next);

    expect(req.doc).toMatchObject(req.body);
  });

  it('should save the document to the database', async () => {
    await put(req, res, next);

    const docInDB = await Model.findOne(req.body);

    expect(docInDB).toMatchObject(req.body);
  });

  it('should call next if document is found', async () => {
    await put(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
