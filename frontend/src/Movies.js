import React from 'react';
import { Grid } from '@mui/material';
import MovieList from './components/MovieList';
import MovieForm from './components/MovieForm';

const Movies = (props) => {
  const { movies, setMovies, genres } = props;
  const token = sessionStorage.getItem('token');

  return (
    <Grid container>
      <Grid
        container
        item
        lg={token ? 8 : 12}
        justifyContent="center"
        mt={5}
        mb={5}
      >
        <MovieList movies={movies} />
      </Grid>
      {token && (
        <Grid container item lg={4} justifyContent="center" mt={2}>
          <MovieForm movies={movies} setMovies={setMovies} genres={genres} />
        </Grid>
      )}
    </Grid>
  );
};

export default Movies;
