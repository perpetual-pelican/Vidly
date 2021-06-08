describe('config startup', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    it('should do nothing if jwtPrivateKey env variable is set', () => {
        expect(() => { require('../../../startup/config'); }).not.toThrow();
    });

    it('should throw if jwtPrivateKey env variable is not set', () => {
        delete process.env.vidly_jwtPrivateKey;
        
        expect(() => { require('../../../startup/config'); }).toThrow();
    });
});
