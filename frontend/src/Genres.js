import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Genres = () => {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await axios.get('/api/genres');
        setGenres(res.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchGenres();
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
