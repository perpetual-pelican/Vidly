const express = require('express');
const mongoose = require('mongoose');
const Fawn = require('fawn');
const _ = require('lodash');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');
const validate = require('../middleware/validate');
const find = require('../middleware/find');
const send = require('../middleware/send');
const { Rental, validate: rval } = require('../models/rental');
const { Customer } = require('../models/customer');
const { Movie } = require('../models/movie');

const router = express.Router();

Fawn.init(mongoose);

router.get('/', auth, async (req, res) => {
    const rentals = await Rental.find().sort('-dateOut');

    res.send(rentals);
});

router.get('/:id', auth, validateObjectId, find(Rental), send);

router.post('/', auth, validate(rval), async (req, res) => {
    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send('Invalid customer id');

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send('Invalid movie id');

    if (movie.numberInStock === 0)
        return res.status(400).send('Movie out of stock');

    let rental = new Rental({
        customer: _.pick(customer, ['_id', 'name', 'phone', 'isGold']),
        movie: _.pick(movie, ['_id', 'title', 'dailyRentalRate'])
    });

    await new Fawn.Task()
        .save('rentals', rental)
        .update('movies', { _id: movie._id }, {
            $inc: { numberInStock: -1 }
        })
        .run();
    
    res.send(rental);
});

router.delete('/:id', auth, admin, validateObjectId, find(Rental), async (req, res) => {
    const rental = req.doc;
    
    await new Fawn.Task()
        .remove('rentals', { _id: rental._id })
        .update('movies', { _id: rental.movie._id }, {
            $inc: { numberInStock: 1 }
        })
        .run();
    
    res.send(rental);
});

module.exports = router;