import React, { useState, useEffect } from 'react';
import { fetchGenres } from './util/request';

const Genres = () => {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    fetchGenres(setGenres);
  }, []);

  return (
    <div>
      <h2>Genres</h2>
      <ul>
        {genres.map((genre) => (
          <li key={genre._id}>{genre.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Genres;
