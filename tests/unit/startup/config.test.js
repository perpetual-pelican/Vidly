describe('config', () => {
    it('should throw if jwtPrivateKey env variable is not set', () => {
        delete process.env.vidly_jwtPrivateKey;
        
        const config = require('../../../startup/config');
        
        expect(config).toThrow();
    });
});