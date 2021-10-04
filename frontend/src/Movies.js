import React from 'react';
import { Grid } from '@mui/material';
import MovieList from './components/MovieList';
import MovieForm from './components/MovieForm';

const Movies = (props) => {
  const { movies, setMovies, genres } = props;
  const token = sessionStorage.getItem('token');

  return (
    <>
      <Grid
        container
        item
        md={token ? 6 : 12}
        justifyContent="center"
        marginTop={5}
      >
        <MovieList movies={movies} />
      </Grid>
      {token && (
        <>
          <Grid container item md={6} justifyContent="center" marginTop={2}>
            <MovieForm movies={movies} setMovies={setMovies} genres={genres} />
          </Grid>
        </>
      )}
    </>
  );
};

export default Movies;
