import React from 'react';
import { Grid, List } from '@mui/material';
import GenreListItem from './GenreListItem';

const GenreList = (props) => {
  const { genres, movies } = props;

  genres.forEach(
    (genre) =>
      (genre.movies = movies.filter((movie) => movie.genres[genre._id]))
  );

  return (
    <List>
      <Grid container justifyContent="center">
        {genres.map((genre) => (
          <Grid item key={genre._id}>
            <GenreListItem genre={genre} />
          </Grid>
        ))}
      </Grid>
    </List>
  );
};

export default GenreList;
