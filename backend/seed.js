const mongoose = require('mongoose');
const { dbString, dbOptions } = require('./src/startup/config');
const { Genre } = require('./src/models/genre');
const { Movie } = require('./src/models/movie');

const data = [
  {
    _id: mongoose.Types.ObjectId(),
    name: 'Action',
    movies: [
      { title: 'Murderbots 2', dailyRentalRate: 0.99, numberInStock: 15 },
      { title: 'Cop Movie', dailyRentalRate: 1.99, numberInStock: 10 },
      { title: 'Deathdome', dailyRentalRate: 2.99, numberInStock: 5 },
    ],
  },
  {
    _id: mongoose.Types.ObjectId(),
    name: 'Adventure',
    movies: [
      { title: 'Lost Kids', dailyRentalRate: 0.99, numberInStock: 15 },
      { title: 'River Rafters', dailyRentalRate: 1.99, numberInStock: 10 },
      { title: 'Through the Woods', dailyRentalRate: 2.99, numberInStock: 5 },
    ],
  },
  {
    _id: mongoose.Types.ObjectId(),
    name: 'Comedy',
    movies: [
      { title: 'Cat Commanders', dailyRentalRate: 0.99, numberInStock: 5 },
      { title: 'Desperate Dudes', dailyRentalRate: 1.99, numberInStock: 10 },
      { title: 'Baby Baller', dailyRentalRate: 2.99, numberInStock: 15 },
    ],
  },
  {
    _id: mongoose.Types.ObjectId(),
    name: 'Fantasy',
    movies: [
      { title: 'Orcs and Goblins', dailyRentalRate: 0.99, numberInStock: 15 },
      {
        title: 'The Long, Cold Dark',
        dailyRentalRate: 1.99,
        numberInStock: 10,
      },
      { title: 'Sewer Dwellers', dailyRentalRate: 2.99, numberInStock: 5 },
    ],
  },
  {
    _id: mongoose.Types.ObjectId(),
    name: 'Horror',
    movies: [
      { title: 'The Spider Queen', dailyRentalRate: 0.99, numberInStock: 15 },
      { title: 'After Hours', dailyRentalRate: 1.99, numberInStock: 10 },
      { title: 'Beyond the Veil', dailyRentalRate: 2.99, numberInStock: 5 },
    ],
  },
];

async function seed() {
  try {
    await mongoose.connect(dbString, dbOptions);

    await Movie.deleteMany();
    await Genre.deleteMany();

    const movies = [];
    const genres = data.map((genre) => {
      movies.push(
        ...genre.movies.map((movie) => ({
          ...movie,
          genres: [{ _id: genre._id, name: genre.name }],
        }))
      );
      return new Genre({ _id: genre._id, name: genre.name }).save();
    });
    await Promise.all(genres);
    await Movie.insertMany(movies);

    await mongoose.disconnect();
  } catch (e) {
    console.error(e);
  }
}

seed();
