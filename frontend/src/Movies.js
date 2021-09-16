import React, { useState, useEffect } from 'react';
import { fetchMovies } from './util/request';

const Movies = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetchMovies(setMovies);
  }, []);

  return (
    <div>
      <h2>Movies</h2>
      <ul>
        {movies.map((movie) => (
          <li key={movie._id}>{movie.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default Movies;
