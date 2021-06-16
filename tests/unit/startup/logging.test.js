jest.mock('winston-mongodb', () => {
  const winston = require('winston');
  winston.transports.MongoDB = jest.fn(() => {
    return new winston.transports.Console();
  });
});

describe('logging startup', () => {
  afterEach(() => {
    jest.resetModules();
  });

  describe('error handling', () => {
    it('should log if an uncaughtException event is encountered', () => {
      require('../../../startup/logging');

      const winston = require('winston');
      winston.exitOnError = false;
      winston.exceptions.logger.log = jest.fn();

      const uncaughtException = new Error('Uncaught Exception');

      expect(() => {
        process.emit('uncaughtException', uncaughtException);
      }).not.toThrow();
      expect(winston.exceptions.logger.log).toHaveBeenCalledWith(
        expect.objectContaining({ error: uncaughtException })
      );
    });

    it('should throw an error if an unhandledRejection event is encountered', async () => {
      require('../../../startup/logging');

      const message = 'Unhandled Rejection';
      const unhandledRejection = new Error(message);

      expect(() => {
        process.emit('unhandledRejection', unhandledRejection);
      }).toThrow(message);
      await expect(Promise.reject(unhandledRejection)).rejects.toThrow(message);
    });
  });

  describe('setup', () => {
    let winston;
    let on;
    let NODE_ENV;

    beforeAll(() => {
      jest.mock('winston', () => {
        const format = { prettyPrint: jest.fn() };
        const configure = jest.fn();
        const transports = {
          Console: jest.fn(),
          File: jest.fn()
        };
        const exceptions = { handle: jest.fn() };
        const add = jest.fn();
        return { format, configure, transports, exceptions, add };
      });
    });

    beforeEach(() => {
      winston = require('winston');
      on = process.on;
      process.on = jest.fn();
      NODE_ENV = process.env.NODE_ENV;
    });

    afterEach(() => {
      process.on = on;
      process.env.NODE_ENV = NODE_ENV;
    });

    it('should add Console transports if NODE_ENV is development (or not set)', () => {
      delete process.env.NODE_ENV;

      require('../../../startup/logging');

      expect(winston.configure).toHaveBeenCalledTimes(1);
      expect(winston.format.prettyPrint).toHaveBeenCalledTimes(1);
      expect(winston.exceptions.handle).toHaveBeenCalledTimes(2);
      expect(winston.add).toHaveBeenCalledTimes(3);
      expect(winston.transports.Console).toHaveBeenCalledTimes(4);
      expect(winston.transports.File).toHaveBeenCalledTimes(2);
      expect(winston.transports.MongoDB).toHaveBeenCalledTimes(2);
      expect(winston.configure).toHaveBeenCalledWith({
        format: winston.format.prettyPrint()
      });
      expect(process.on).toHaveBeenCalledWith(
        'unhandledRejection',
        expect.any(Function)
      );
    });

    it('should set up winston', () => {
      require('../../../startup/logging');

      expect(winston.configure).toHaveBeenCalledTimes(1);
      expect(winston.format.prettyPrint).toHaveBeenCalledTimes(1);
      expect(winston.exceptions.handle).toHaveBeenCalledTimes(1);
      expect(winston.add).toHaveBeenCalledTimes(2);
      expect(winston.transports.Console).toHaveBeenCalledTimes(2);
      expect(winston.transports.File).toHaveBeenCalledTimes(2);
      expect(winston.transports.MongoDB).toHaveBeenCalledTimes(2);
      expect(winston.configure).toHaveBeenCalledWith({
        format: winston.format.prettyPrint()
      });
      expect(process.on).toHaveBeenCalledWith(
        'unhandledRejection',
        expect.any(Function)
      );
    });
  });
});
