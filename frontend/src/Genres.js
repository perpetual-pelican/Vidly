import React, { useState } from 'react';
import { Grid, Typography } from '@mui/material';
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
    <>
      <Grid container justifyContent="center" alignItems="center">
        <Typography variant="h4">Genres</Typography>
      </Grid>
      {token && (
        <Grid container justifyContent="center" alignItems="center">
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
        </Grid>
      )}
      <Grid container justifyContent="center">
        <ul>
          {genres.map((genre) => (
            <li key={genre._id}>{genre.name}</li>
          ))}
        </ul>
      </Grid>
    </>
  );
};

export default Genres;
