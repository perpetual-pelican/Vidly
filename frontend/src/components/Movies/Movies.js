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
  const { movies, setMovies, genres, token } = props;
  const [showTable, setShowTable] = useState(false);
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <Grid container item lg={token && showForm ? 8 : 12} mb={5}>
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
          {token && showTable ? (
            <MovieTable movies={movies} />
          ) : (
            <MovieList movies={movies} shift={token && showForm} />
          )}
        </Grid>
      </Grid>
      {token && showForm && (
        <Grid container item lg={4} justifyContent="center">
          <MovieForm movies={movies} setMovies={setMovies} genres={genres} />
        </Grid>
      )}
    </>
  );
};

export default Movies;
