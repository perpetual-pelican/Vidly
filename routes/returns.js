const express = require('express');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { Rental } = require('../models/rental');
const { Movie } = require('../models/movie');
const { validate: rVal } = require('../models/rental');

const router = express.Router();

router.post('/', auth, validate(rVal), async (req, res) => {
  const rental = await Rental.lookup(req.body.customerId, req.body.movieId);
  if (!rental)
    return res.status(404).send('No active rental for customer and movie');

  const movie = await Movie.findById(rental.movie._id);
  movie.set({ numberInStock: movie.numberInStock + 1 });

  await mongoose.connection.transaction(async (session) => {
    await movie.save({ session });
    await rental.return({ session });
  });

  res.send(rental);
});

module.exports = router;
