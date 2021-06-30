const express = require('express');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');
const validate = require('../middleware/validate');
const find = require('../middleware/find');
const send = require('../middleware/send');
const remove = require('../middleware/remove');
const { Movie, validatePost, validatePut } = require('../models/movie');
const { Genre } = require('../models/genre');

const router = express.Router();

router.get('/', async (req, res) => {
  const movies = await Movie.find().sort('title').lean();

  res.send(movies);
});

router.get('/:id', validateObjectId, find(Movie, 'lean'), send);

router.post('/', auth, validate(validatePost), async (req, res) => {
  if (req.body.genreIds) {
    let genres = [];
    for (const genreId of req.body.genreIds) {
      let genre = await Genre.findById(genreId).lean();
      if (!genre) return res.status(400).send('Invalid genre id');
      genres.push(genre);
    }
    delete req.body.genreIds;
    req.body.genres = genres;
  }

  const movie = new Movie(req.body);
  await movie.save();

  res.send(movie);
});

router.put(
  '/:id',
  auth,
  validateObjectId,
  find(Movie),
  validate(validatePut),
  async (req, res) => {
    let movie = req.doc;

    if (req.body.genreIds) {
      let genres = [];
      for (const genreId of req.body.genreIds) {
        let genre = await Genre.findById(genreId).lean();
        if (!genre) return res.status(400).send('Invalid genre id');
        genres.push(genre);
      }
      movie.genres = genres;
    }

    movie.set(req.body);
    await movie.save();

    res.send(movie);
  }
);

router.delete('/:id', auth, admin, validateObjectId, remove(Movie), send);

module.exports = router;
