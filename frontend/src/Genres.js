import React, { useState } from 'react';
import { Grid, FormGroup, FormControlLabel, Switch } from '@mui/material';
import GenreList from './components/GenreList';
import GenreTable from './components/GenreTable';
import GenreForm from './components/GenreForm';

const Genres = (props) => {
  const { genres, setGenres, movies } = props;
  const [showTable, setShowTable] = useState(false);
  const token = sessionStorage.getItem('token');

  return (
    <>
      <Grid container justifyContent="center">
        {token && (
          <Grid container justifyContent="center" alignItems="flex-end">
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
        )}
        {showTable ? (
          <GenreTable genres={genres} movies={movies} />
        ) : (
          <GenreList genres={genres} />
        )}
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
