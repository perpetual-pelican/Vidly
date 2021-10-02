import React, { useState } from 'react';
import { postMovie } from '../util/request';

const MovieForm = (props) => {
  const { movies, setMovies, genres } = props;
  const [newMovie, setNewMovie] = useState({
    title: '',
    dailyRentalRate: 0,
    numberInStock: 0,
  });

  const onSubmit = async (event) => {
    event.preventDefault();
    const genreOptions = document.getElementsByTagName('select')[0]?.options;
    const selectedGenreIds = [];
    for (const option of genreOptions) {
      if (option.selected) {
        const genre = JSON.parse(option.value);
        selectedGenreIds.push(genre._id);
      }
    }
    try {
      const data = await postMovie({ ...newMovie, genreIds: selectedGenreIds });
      if (typeof data === 'string') {
        alert(data);
        return;
      }
      setMovies([data, ...movies]);
      setNewMovie({
        title: '',
        dailyRentalRate: 0,
        numberInStock: 0,
        genreIds: [],
      });
    } catch (e) {
      alert(e);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <h4>Add Movie: </h4>
      <div>
        <label>Title: </label>
        <input
          type="text"
          placeholder="title"
          value={newMovie.title}
          onChange={(event) =>
            setNewMovie({ ...newMovie, title: event.target.value })
          }
        />
      </div>
      <div>
        <label>Daily Rental Rate: </label>
        <input
          type="number"
          placeholder="daily rental rate"
          value={newMovie.dailyRentalRate}
          onChange={(event) =>
            setNewMovie({
              ...newMovie,
              dailyRentalRate: event.target.value,
            })
          }
        />
      </div>
      <div>
        <label>Number in Stock: </label>
        <input
          type="number"
          placeholder="number in stock"
          value={newMovie.numberInStock}
          onChange={(event) =>
            setNewMovie({ ...newMovie, numberInStock: event.target.value })
          }
        />
      </div>
      <div>
        <label>Genres: </label>
        <select multiple>
          {genres.map((genre) => (
            <option
              key={genre._id}
              label={genre.name}
              value={JSON.stringify(genre)}
            />
          ))}
        </select>
      </div>
      <input type="submit" value="Add Movie" />
    </form>
  );
};

export default MovieForm;
