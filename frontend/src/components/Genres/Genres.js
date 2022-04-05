import React, { useState } from 'react';
import { Grid, FormGroup, FormControlLabel, Switch } from '@mui/material';
import GenreList from './GenreList';
import GenreTable from './GenreTable';
import GenreForm from './GenreForm';
import { deleteGenre } from '../../util/request';

const Genres = (props) => {
  const { genres, setGenres, movies, setMovies, user } = props;
  const [showTable, setShowTable] = useState(false);

  function handleDelete(genreId) {
    deleteGenre(genreId);
    setGenres((prevGenres) =>
      prevGenres.filter((genre) => genre._id !== genreId)
    );
    setMovies((prevMovies) =>
      prevMovies.map((movie) => {
        delete movie.genres[genreId];
        return movie;
      })
    );
  }

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
          <GenreList
            genres={genres}
            handleDelete={handleDelete}
            movies={movies}
            user={user}
          />
        )}
      </Grid>
      {user && (
        <Grid container justifyContent="center">
          <GenreForm genres={genres} setGenres={setGenres} />
        </Grid>
      )}
    </>
  );
};

export default Genres;
