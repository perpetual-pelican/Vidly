import React, { useState } from 'react';
import {
  Grid,
  FormGroup,
  FormControlLabel,
  Switch,
  Button,
} from '@mui/material';
import MovieList from './MovieList';
import MovieTable from './MovieTable';
import MovieForm from './MovieForm';

const Movies = (props) => {
  const { movies, setMovies, genres } = props;
  const [showTable, setShowTable] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const token = sessionStorage.getItem('token');

  return (
    <>
      <Grid container item lg={showForm ? 8 : 12} mb={5}>
        {token && (
          <Grid container alignItems="flex-end">
            <Grid item>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={showTable}
                      onChange={() => {
                        setShowTable((show) => !show);
                      }}
                    />
                  }
                  label="Show Table"
                />
              </FormGroup>
            </Grid>
            <Grid item flexGrow={1} />
            <Grid item>
              <Button
                onClick={() => {
                  setShowForm((show) => !show);
                }}
              >
                {showForm ? 'Hide Form' : 'Add Movie'}
              </Button>
            </Grid>
          </Grid>
        )}
        <Grid container>
          {showTable ? (
            <MovieTable movies={movies} />
          ) : (
            <MovieList movies={movies} shift={showForm} />
          )}
        </Grid>
      </Grid>
      {showForm && (
        <Grid container item lg={4} justifyContent="center" alignItems="center">
          <MovieForm movies={movies} setMovies={setMovies} genres={genres} />
        </Grid>
      )}
    </>
  );
};

export default Movies;
