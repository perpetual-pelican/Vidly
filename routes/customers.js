const express = require('express');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');
const { Customer, validatePost, validatePut } = require('../models/customer');

const router = express.Router();

router.get('/', auth, async (req, res) => {
    const customers = await Customer.find().sort('name');

    res.send(customers);
});

router.get('/:id', [auth, validateObjectId], async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).send("Customer id not found");

    res.send(customer);
});

router.post('/', auth, async (req, res) => {
    const { error } = validatePost(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = new Customer(req.body);
    await customer.save();

    res.send(customer);
});

router.put('/:id', [auth, validateObjectId], async (req, res) => {
    let customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).send("Customer id not found");

    const { error } = validatePut(req.body);
    if (error) return res.status(400).send(error.message);

    customer.set(req.body);
    await customer.save();

    res.send(customer);
});

router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).send("Customer id not found");

    res.send(customer);
});

module.exports = router;