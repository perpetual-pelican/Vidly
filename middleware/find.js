module.exports = (Model) => {
    return async (req, res, next) => {
        const modelString = Model.inspect();
        const modelName = modelString.substring(8, modelString.length-2);

        const doc = await Model.findById(req.params.id);
        if (!doc) return res.status(404).send(`${modelName} id not found`);

        req.doc = doc;

        next();
    };
};