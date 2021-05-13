const express = require('express');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');
const { Movie, validatePost, validatePut } = require('../models/movie');
const { Genre } = require('../models/genre');

const router = express.Router();

router.get('/', async (req, res) => {
    const movies = await Movie.find().sort('title');

    res.send(movies);
});

router.get('/:id', validateObjectId, async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).send('The movie with the given id was not found');

    res.send(movie);
});

router.post('/', auth, async (req, res) => {
    const { error } = validatePost(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    let genres = [];
    for (let i = 0; i < req.body.genreIds.length; i++) {
        let genre = await Genre.findById(req.body.genreIds[i]);
        if (!genre) return res.status(400).send('Invalid genre');
        genres.push({ _id: genre._id, name: genre.name });
    }
    const movie = new Movie({
        title: req.body.title,
        genres: genres,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });
    await movie.save();

    res.send(movie);
});

router.put('/:id', [auth, validateObjectId], async (req, res) => {
    let movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).send('The movie with the given id was not found');

    const { error } = validatePut(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    if (req.body.genreIds) {
        let genres = [];
        for (let i = 0; i < req.body.genreIds.length; i++) {
            let genre = await Genre.findById(req.body.genreIds[i]);
            if (!genre) return res.status(400).send('Invalid genre');
            genres.push({ _id: genre._id, name: genre.name });
        }
        movie.genres = genres;
    }
    for (let property in movie) {
        if (req.body[property])
            movie[property] = req.body[property];
    }
    await movie.save();

    res.send(movie);
});

router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) return res.status(404).send("The movie with the given title was not found");

    res.send(movie);
});

module.exports = router;