import React, { useState } from 'react';
import { postGenre } from './util/request';

const Genres = (props) => {
  const { genres, setGenres } = props;
  const [newGenre, setNewGenre] = useState('');
  const token = sessionStorage.getItem('token');

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const data = await postGenre({ name: newGenre });
      if (typeof data === 'string') {
        alert(data);
        return;
      }
      setGenres([data, ...genres]);
      setNewGenre('');
    } catch (e) {
      alert(e);
    }
  };

  return (
    <div>
      <h2>Genres</h2>
      {token && (
        <form onSubmit={onSubmit}>
          <label>Add Genre: </label>
          <input
            type="text"
            placeholder="genre name"
            value={newGenre}
            onChange={(event) => setNewGenre(event.target.value)}
          />
          <input type="submit" value="Add" />
        </form>
      )}
      <ul>
        {genres.map((genre) => (
          <li key={genre._id}>{genre.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Genres;
