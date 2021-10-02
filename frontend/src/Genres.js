import React from 'react';
import { Grid, Typography } from '@mui/material';
import GenreList from './components/GenreList';
import GenreForm from './components/GenreForm';

const Genres = (props) => {
  const { genres, setGenres } = props;
  const token = sessionStorage.getItem('token');

  return (
    <>
      <Grid container justifyContent="center">
        <Typography variant="h4">Genres</Typography>
      </Grid>
      <Grid container justifyContent="center">
        <GenreList genres={genres} setGenres={setGenres} />
      </Grid>
      {token && (
        <Grid container justifyContent="center">
          <GenreForm genres={genres} setGenres={setGenres} />
        </Grid>
      )}
    </>
  );
};

export default Genres;
