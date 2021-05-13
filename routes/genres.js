const express = require('express');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { Genre, validatePost, validatePut } = require('../models/genre');

const router = express.Router();

router.get('/', async (req, res) => {
    const genres = await Genre.find().sort('name');

    res.send(genres);
});

router.get('/:name', async (req, res) => {
    const genre = await Genre.findOne({ name: req.params.name });
    if (!genre) return res.status(404).send("Genre name was not found");

    res.send(genre);
});

router.post('/', auth, async (req, res) => {
    const { error } = validatePost(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let genre = await Genre.findOne({ name: req.body.name });
    if (genre) return res.status(400).send("Genre name already exists");

    genre = new Genre({ name: req.body.name });
    await genre.save();

    res.send(genre);
});

router.put('/:name', auth, async (req, res) => {
    let genre = await Genre.findOne({ name: req.params.name });
    if (!genre) return res.status(404).send("Genre name was not found");

    const { error } = validatePut(req.body);
    if (error) return res.status(400).send(error.message);
    
    const targetGenre = await Genre.findOne({ name: req.body.name });
    if (targetGenre) return res.status(400).send("Genre name already exists");

    genre.name = req.body.name;
    await genre.save();

    res.send(genre);
});

router.delete('/:name', [auth, admin], async (req, res) => {
    const genre = await Genre.findOneAndDelete({ name: req.params.name });
    if (!genre) return res.status(404).send("Genre name was not found");

    res.send(genre);
});

module.exports = router;