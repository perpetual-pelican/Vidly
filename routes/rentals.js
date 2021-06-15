const express = require('express');
const mongoose = require('mongoose');
const _ = require('lodash');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');
const validate = require('../middleware/validate');
const find = require('../middleware/find');
const send = require('../middleware/send');
const { Rental, validate: rVal } = require('../models/rental');
const { Customer } = require('../models/customer');
const { Movie } = require('../models/movie');

const router = express.Router();

router.get('/', auth, async (req, res) => {
    const rentals = await Rental.find().sort('-dateOut');

    res.send(rentals);
});

router.get('/:id', auth, validateObjectId, find(Rental), send);

router.post('/', auth, validate(rVal), async (req, res) => {
    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send('Invalid customer id');

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send('Invalid movie id');

    if (movie.numberInStock < 1)
        return res.status(400).send('Movie out of stock');
    movie.set({ numberInStock: movie.numberInStock-1 });

    let rental = await Rental.lookup(req.body.customerId, req.body.movieId);
    if (rental)
        return res.status(400).send('Customer is already renting this movie');

    rental = new Rental({
        customer: _.pick(customer, ['_id', 'name', 'phone', 'isGold']),
        movie: _.pick(movie, ['_id', 'title', 'dailyRentalRate'])
    });
    
    await mongoose.connection.transaction(async (session) => {
        await movie.save({ session });
        await rental.save({ session });
    });
    
    res.send(rental);
});

router.delete('/:id', auth, admin, validateObjectId, find(Rental), async (req, res) => {
    let rental = req.doc;

    const movie = await Movie.findById(rental.movie._id);
    
    if (!rental.dateReturned) {
        movie.set({ numberInStock: movie.numberInStock+1 });
        await mongoose.connection.transaction(async (session) => {
            await movie.save({ session });
            rental = await rental.remove({ session });
        });
    } else rental = await rental.remove();
    
    res.send(rental);
});

module.exports = router;