const express = require('express');
const mongoose = require('mongoose');
const winston = require('winston');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');
const validate = require('../middleware/validate');
const find = require('../middleware/find');
const send = require('../middleware/send');
const { Genre, validate: gVal } = require('../models/genre');
const { Movie } = require('../models/movie');

const router = express.Router();

router.get('/', async (req, res) => {
  const genres = await Genre.find().sort('name').lean();

  res.send(genres);
});

router.get('/:id', validateObjectId, find(Genre, 'lean'), send);

router.post('/', auth, validate(gVal), async (req, res) => {
  let genre = await Genre.findOne({ name: req.body.name });
  if (genre) return res.status(400).send('Genre Name already exists');

  genre = new Genre(req.body);
  await genre.save();

  return res.send(genre);
});

router.put(
  '/:id',
  auth,
  validateObjectId,
  find(Genre),
  validate(gVal),
  async (req, res) => {
    let genre = await Genre.findOne({ name: req.body.name }).lean();
    if (genre) return res.status(400).send('Genre Name already exists');

    genre = req.doc;

    genre.set(req.body);
    await genre.save();

    return res.send(genre);
  }
);

router.delete('/:id', auth, admin, validateObjectId, async (req, res) => {
  const genreId = req.params.id;
  let genre;

  const movieFilter = {};
  movieFilter[`genres.${genreId}`] = { $exists: true };
  const movieField = {};
  movieField[`genres.${genreId}`] = '';
  const movieUpdate = { $unset: movieField };

  let success = false;
  await mongoose.connection
    .transaction(async (session) => {
      genre = await Genre.findByIdAndDelete(genreId).session(session).lean();
      if (!genre) {
        res.status(404).send(`Genre id not found`);
        return session.abortTransaction();
      }

      await Movie.updateMany(movieFilter, movieUpdate, session);

      success = true;
      return success;
    })
    .catch((err) => {
      winston.error(err.message, { metadata: { error: err } });
      return res.status(500).send('Transaction failed. Data unchanged.');
    });

  if (success) return res.send(genre);
});

module.exports = router;
