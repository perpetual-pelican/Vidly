import React, { useState } from 'react';
import {
  Grid,
  FormGroup,
  FormControlLabel,
  Switch,
  Snackbar,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import GenreList from './GenreList';
import GenreTable from './GenreTable';
import GenreForm from './GenreForm';
import { deleteGenre } from '../../util/request';

const Genres = (props) => {
  const { genres, setGenres, movies, setMovies, user } = props;
  const [showTable, setShowTable] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const handleSnackbarOpen = () => setSnackbarOpen(true);
  const handleSnackbarClose = () => setSnackbarOpen(false);

  function handleDelete(genre) {
    deleteGenre(genre._id);
    setGenres((prevGenres) =>
      prevGenres.filter((prevGenre) => prevGenre._id !== genre._id)
    );
    setMovies((prevMovies) =>
      prevMovies.map((movie) => {
        delete movie.genres[genre._id];
        return movie;
      })
    );
    setSnackbarMessage(`Genre "${genre.name}" deleted`);
    handleSnackbarOpen();
  }

  const snackbarAction = (
    <>
      <IconButton
        aria-label="close"
        color="inherit"
        onClick={handleSnackbarClose}
      >
        <CloseIcon />
      </IconButton>
    </>
  );

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
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={5000}
          onClose={handleSnackbarClose}
          message={snackbarMessage}
          action={snackbarAction}
        />
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
          <GenreForm setGenres={setGenres} />
        </Grid>
      )}
    </>
  );
};

export default Genres;
