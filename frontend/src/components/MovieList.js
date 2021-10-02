import React from 'react';

const MovieList = (props) => {
  const { movies } = props;

  return (
    <ul>
      {movies.map((movie) => (
        <li key={movie._id}>{movie.title}</li>
      ))}
    </ul>
  );
};

export default MovieList;
