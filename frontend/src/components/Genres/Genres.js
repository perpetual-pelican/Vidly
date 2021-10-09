import React, { useState } from 'react';
import { Grid, FormGroup, FormControlLabel, Switch } from '@mui/material';
import GenreList from './GenreList';
import GenreTable from './GenreTable';
import GenreForm from './GenreForm';

const Genres = (props) => {
  const { genres, setGenres, movies, token } = props;
  const [showTable, setShowTable] = useState(false);

  return (
    <>
      <Grid container justifyContent="center">
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
        {showTable ? (
          <GenreTable genres={genres} movies={movies} />
        ) : (
          <GenreList genres={genres} movies={movies} />
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
