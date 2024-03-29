exports.user = {
  name: { max: 64 },
  password: { min: 8, max: 72 },
};

exports.customer = {
  name: { min: 3, max: 128 },
  phone: { min: 5, max: 32 },
};

exports.genre = { name: { min: 3, max: 64 } };

exports.movie = {
  title: { min: 3, max: 64 },
  dailyRentalRate: { min: 0, max: 20 },
  numberInStock: { min: 0, max: 1000 },
  genres: { min: 1, max: 5 },
};
