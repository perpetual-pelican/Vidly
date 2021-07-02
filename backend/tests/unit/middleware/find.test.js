const mongoose = require('mongoose');
const { dbString, dbOptions } = require('../../../startup/config');
const find = require('../../../middleware/find');

describe('find middleware', () => {
  let Model;
  let doc;
  let req;
  let res;
  let next;

  beforeAll(async () => {
    Model = mongoose.model('Model', new mongoose.Schema({ name: String }));
    await mongoose.connect(`${dbString}_middleware_find`, dbOptions);
  });

  beforeEach(async () => {
    doc = await new Model({ name: 'Model Name' }).save();
    req = { params: { id: doc._id } };
    res = { status: jest.fn().mockReturnValue({ send: jest.fn() }) };
    next = jest.fn();
  });

  afterEach(async () => {
    await Model.deleteMany();
  });

  afterAll(async () => {
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
