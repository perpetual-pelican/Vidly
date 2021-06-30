module.exports = (validator) => {
  return (req, res, next) => {
    const { error, value } = validator(req.body);
    if (error) return res.status(400).send(error.message);

    req.body = value;

    next();
  };
};
