const winston = require('winston');
const error = require('../../../middleware/error');

winston.error = jest.fn();

describe('error middleware', () => {
  let err;
  let req;
  let res;
  let next;

  beforeEach(() => {
    err = { message: 'error message' };
    req = { header: jest.fn().mockReturnValue() };
    res = { status: jest.fn().mockReturnValue({ send: jest.fn() }) };
    next = jest.fn();
  });

  it('should log the error with winston', async () => {
    error(err, req, res, next);

    expect(winston.error).toHaveBeenCalledWith(err.message, {
      metadata: { error: err }
    });
  });

  it('should return 500 if an unexpected error occurs', async () => {
    error(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
