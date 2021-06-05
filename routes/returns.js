const express = require('express');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { Rental } = require('../models/rental');
const { Movie } = require('../models/movie');
const { validate: rval } = require('../models/rental');

const router = express.Router();

router.post('/', auth, validate(rval), async (req, res) => {
    const rental = await Rental.lookup(req.body.customerId, req.body.movieId);
    if (!rental) return res.status(404).send('Customer/Movie not found');

    if (rental.dateReturned)
        return res.status(400).send('Return already processed');

    await rental.return();

    await Movie.updateOne({ _id: rental.movie._id }, {
        $inc: { numberInStock: 1 }
    });
    
    res.send(rental);
});

module.exports = router;