module.exports = (Model) => {
    return async (req, res, next) => {
        req.doc = new Model(req.body);
        await req.doc.save();

        next();
    };
};