import React from 'react';
import { Grid, Typography } from '@mui/material';
import GenreForm from './components/GenreForm';

const Genres = (props) => {
  const { genres, setGenres } = props;
  const token = sessionStorage.getItem('token');

  return (
    <>
      <Grid container justifyContent="center">
        <Typography variant="h4">Genres</Typography>
      </Grid>
      {token && (
        <Grid container justifyContent="center">
          <GenreForm genres={genres} setGenres={setGenres} />
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
