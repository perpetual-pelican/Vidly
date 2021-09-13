import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Movies = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get('/api/movies');
        setMovies(res.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchMovies();
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
