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

    await Genre.deleteMany();
    await Movie.deleteMany();

    const promisedGenres = data.map(async (genreData) =>
      new Genre({
        _id: genreData._id,
        name: genreData.name,
      }).save()
    );
    const genres = await Promise.all(promisedGenres);

    const movies = [];
    for (let i = 0; i < genres.length; i += 1) {
      movies.push(
        ...data[i].movies.map((movie) => ({
          ...movie,
          genres: new Map([[genres[i]._id, genres[i]]]),
        }))
      );
    }
    await Movie.insertMany(movies);

    await mongoose.disconnect();
  } catch (e) {
    console.error(e);
  }
}

seed();
