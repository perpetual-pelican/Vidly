/* istanbul ignore file */

const request = require('supertest');
const mongoose = require('mongoose');
const winston = require('winston');
const db = require('./startup/config').db;

let route;
let app;

module.exports.setup = function (routeName, appToTest) {
  if (routeName && typeof routeName !== 'string')
    throw new Error('routeName must be a string');
  if (appToTest && typeof appToTest !== 'function')
    throw new Error('appToTest must be an express app');

  route = routeName;
  app = appToTest;

  beforeAll(async () => {
    await mongoose.connect(`${db}_${route}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    });
    winston.error = jest.fn();
  });

  afterAll(async () => {
    for (const name of Object.keys(mongoose.connection.collections)) {
      await mongoose.connection.collections[name].deleteMany();
    }
    await mongoose.disconnect();
  });
};

const checkSetup = () => {
  if (!app || !route)
    throw new Error(
      'setup must be called with route and app before using request functions'
    );
};

module.exports.request = {
  getAll: function (req) {
    checkSetup();
    if (!req || !req.token) return request(app).get(`/api/${route}`);
    return request(app).get(`/api/${route}`).set('x-auth-token', req.token);
  },
  getOne: function (req) {
    checkSetup();
    if (!req.token) return request(app).get(`/api/${route}/${req.id}`);
    return request(app)
      .get(`/api/${route}/${req.id}`)
      .set('x-auth-token', req.token);
  },
  post: function (req) {
    checkSetup();
    if (!req.token) {
      return request(app).post(`/api/${route}`).send(req.body);
    }
    return request(app)
      .post(`/api/${route}`)
      .set('x-auth-token', req.token)
      .send(req.body);
  },
  put: function (req) {
    checkSetup();
    if (!req.token) {
      return request(app).put(`/api/${route}/${req.id}`).send(req.body);
    }
    return request(app)
      .put(`/api/${route}/${req.id}`)
      .set('x-auth-token', req.token)
      .send(req.body);
  },
  del: function (req) {
    checkSetup();
    if (!req.token) {
      return request(app).delete(`/api/${route}/${req.id}`);
    }
    return request(app)
      .delete(`/api/${route}/${req.id}`)
      .set('x-auth-token', req.token);
  }
};

module.exports.tokenEmpty = async function (exec, req) {
  req.token = '';

  const res = await exec(req);

  expect(res.status).toBe(401);
  expect(res.text).toMatch(/[Dd]enied/);
};

module.exports.tokenInvalid = async function (exec, req) {
  req.token = 'invalid';

  const res = await exec(req);

  expect(res.status).toBe(400);
  expect(res.text).toMatch(/[Ii]nvalid.*[Tt]oken/);
};

module.exports.adminFalse = async function (exec, req) {
  const res = await exec(req);

  expect(res.status).toBe(403);
  expect(res.text).toMatch(/[Dd]enied/);
};

module.exports.idInvalid = async function (exec, req) {
  req.id = 'invalid';

  const res = await exec(req);

  expect(res.status).toBe(404);
  expect(res.text).toMatch(/[Ii]nvalid.*[Ii][Dd]/);
};

module.exports.idNotFound = async function (exec, req) {
  req.id = mongoose.Types.ObjectId().toHexString();

  const res = await exec(req);

  expect(res.status).toBe(404);
  expect(res.text).toMatch(/[Ii][Dd].*[Nn]ot.*[Ff]ound/);
};

module.exports.requestEmpty = async function (exec, req) {
  req.body = {};

  const res = await exec(req);

  expect(res.status).toBe(400);
  expect(res.text).toMatch(/[Pp]roperty.*[Rr]equired/);
};

module.exports.requestInvalid = async function (exec, req) {
  if (req.body) req.body.invalidProperty = 'invalid';
  else req.body = { invalidProperty: 'invalid' };

  const res = await exec(req);

  expect(res.status).toBe(400);
  expect(res.text).toMatch(/[Nn]ot.*[Aa]llowed/);
};
