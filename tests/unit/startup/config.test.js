describe('config startup', () => {
  const vidlyKey = process.env.vidly_jwtPrivateKey;
  const NODE_ENV = process.env.NODE_ENV;

  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    process.env.vidly_jwtPrivateKey = vidlyKey;
    process.env.NODE_ENV = NODE_ENV;
  });

  it('should throw if jwtPrivateKey env variable is not set', () => {
    delete process.env.vidly_jwtPrivateKey;

    expect(() => {
      require('../../../startup/config');
    }).toThrow();
  });

  it('should not throw if jwtPrivateKey env variable is set', () => {
    expect(() => {
      require('../../../startup/config');
    }).not.toThrow();
  });

  it('should use localhost for db string if os type is not Windows', () => {
    const os = require('os');
    os.type = jest.fn().mockReturnValue('Linux');

    const config = require('../../../startup/config');

    expect(config.db).toMatch(/localhost/);
  });

  it('should use hostname for db string if os type is Windows', () => {
    const os = require('os');
    os.type = jest.fn().mockReturnValue('Windows_NT');

    const config = require('../../../startup/config');

    expect(config.db).toMatch(new RegExp(os.hostname()));
  });

  it('should add development to db string if NODE_ENV is undefined', () => {
    delete process.env.NODE_ENV;

    const config = require('../../../startup/config');

    expect(config.db).toMatch(/development/);
  });

  it('should add NODE_ENV to db string if it is defined', () => {
    const config = require('../../../startup/config');

    expect(config.db).toMatch(/test/);
  });
});
