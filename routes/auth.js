const express = require('express');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const validate = require('../middleware/validate');
const { User } = require('../models/user');

const router = express.Router();

router.post('/', validate(validateUser), async (req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Invalid email or password');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid email or password');

    const token = user.generateAuthToken();
    
    res.send(token);
});

function validateUser(user) {
    const schema = Joi.object({
        email: Joi.string().max(255).required(),
        password: Joi.string().max(255).required()
    });
    return schema.validate(user);
}

module.exports = router;