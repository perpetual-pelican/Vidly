const _ = require('lodash');
const express = require('express');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { User, validateUser } = require('../models/user');

const router = express.Router();

router.get('/', [auth, admin], async (req, res) => {
    const users = await User.find().select('-password').sort('name');

    res.send(users);
});

router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(400).send('User not found');

    res.send(user);
});

router.post('/', async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('Email already in use');


    user = new User(_.pick(req.body, ['name', 'email', 'password']));

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    const token = user.generateAuthToken();
    const payload = _.pick(user, ['_id', 'name', 'email']);
    
    res.header('x-auth-token', token).send(payload);
});

module.exports = router;