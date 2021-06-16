const mongoose = require('mongoose');
const db = require('../../../startup/config').db;
const find = require('../../../middleware/find');

describe('find middleware', () => {
  let Model;
  let doc;
  let req;
  let res;
  let next;

  beforeAll(async () => {
    await mongoose.connect(db + '_find', {
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

    await find(Model)(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('should populate req.doc with the requested document', async () => {
    await find(Model)(req, res, next);

    expect(req).toHaveProperty('doc');
  });

  it('should call next if document is found', async () => {
    await find(Model)(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
