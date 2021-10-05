import React, { useState } from 'react';
import { Grid, FormGroup, FormControlLabel, Switch } from '@mui/material';
import MovieList from './components/MovieList';
import MovieTable from './components/MovieTable';
import MovieForm from './components/MovieForm';

const Movies = (props) => {
  const { movies, setMovies, genres } = props;
  const [showTable, setShowTable] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const token = sessionStorage.getItem('token');

  return (
    <Grid container>
      <Grid
        container
        item
        lg={showForm ? 8 : 12}
        justifyContent="center"
        mb={5}
      >
        {token && (
          <Grid container>
            <FormGroup sx={{ flexGrow: 1 }}>
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
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={showForm}
                    onChange={() => {
                      setShowForm((show) => !show);
                    }}
                  />
                }
                label="Show Form"
              />
            </FormGroup>
          </Grid>
        )}
        {showTable ? (
          <MovieTable movies={movies} />
        ) : (
          <MovieList movies={movies} />
        )}
      </Grid>
      {showForm && (
        <Grid container item lg={4} justifyContent="center" mt={2}>
          <MovieForm movies={movies} setMovies={setMovies} genres={genres} />
        </Grid>
      )}
    </Grid>
  );
};

export default Movies;
