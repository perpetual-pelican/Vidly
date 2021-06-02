const express = require('express');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');
const { Genre, validate } = require('../models/genre');

const router = express.Router();

router.get('/', async (req, res) => {
    const genres = await Genre.find().sort('name');

    res.send(genres);
});

router.get('/:id', validateObjectId, async (req, res) => {
    const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).send("Genre id not found");

    res.send(genre);
});

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const targetGenre = await Genre.findOne({ name: req.body.name });
    if (targetGenre) return res.status(400).send("Genre name already exists");

    const genre = new Genre({ name: req.body.name });
    await genre.save();

    res.send(genre);
});

router.put('/:id', [auth, validateObjectId], async (req, res) => {
    let genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).send("Genre id not found");

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.message);
    
    const targetGenre = await Genre.findOne({ name: req.body.name });
    if (targetGenre) return res.status(400).send("Genre name already exists");

    genre.name = req.body.name;
    await genre.save();

    res.send(genre);
});

router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {
    const genre = await Genre.findByIdAndDelete(req.params.id);
    if (!genre) return res.status(404).send("Genre id not found");

    res.send(genre);
});

module.exports = router;