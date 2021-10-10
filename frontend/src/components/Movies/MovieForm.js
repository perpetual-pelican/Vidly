import React, { useState } from 'react';
import {
  Grid,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
  Button,
  Alert,
} from '@mui/material';
import { postMovie } from '../../util/request';
const {
  validateTitle,
  validateRentalRate,
  validateNumInStock,
  validateGenres,
} = require('../../util/validators/movieValidators');

const MovieForm = (props) => {
  const { movies, setMovies, genres } = props;
  const [newMovie, setNewMovie] = useState({
    title: '',
    dailyRentalRate: '',
    numberInStock: '',
  });
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [errors, setErrors] = useState({});
  const [fieldsFilled, setFieldsFilled] = useState({});

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    const selectedGenreIds = selectedGenres.map((genre) => genre._id);
    try {
      const data = await postMovie({ ...newMovie, genreIds: selectedGenreIds });
      if (typeof data === 'string') {
        setErrors((currentErrors) => ({ ...currentErrors, form: data }));
        return;
      } else {
        setErrors((currentErrors) => {
          delete currentErrors.form;
          return currentErrors;
        });
      }
      setMovies([data, ...movies]);
      setNewMovie({
        title: '',
        dailyRentalRate: 0,
        numberInStock: 0,
      });
      setSelectedGenres([]);
      setFieldsFilled({});
    } catch (e) {
      alert(e);
    }
  };

  const validateField = (field, validator, value) => {
    const { error } = validator(value);
    if (error) {
      setErrors((currentErrors) => {
        currentErrors[field] = error.details[0].message;
        return currentErrors;
      });
      return false;
    } else if (errors[field]) {
      setErrors((currentErrors) => {
        delete currentErrors[field];
        return currentErrors;
      });
    }
    return true;
  };

  const validateForm = () => {
    setFieldsFilled({
      title: true,
      dailyRentalRate: true,
      numberInStock: true,
      genres: true,
    });
    const titleValid = validateField('title', validateTitle, newMovie.title);
    const rentalRateValid = validateField(
      'dailyRentalRate',
      validateRentalRate,
      newMovie.dailyRentalRate
    );
    const numInStockValid = validateField(
      'numberInStock',
      validateNumInStock,
      newMovie.numberInStock
    );
    const genresValid = validateField('genres', validateGenres, selectedGenres);
    const isValid =
      titleValid && rentalRateValid && numInStockValid && genresValid;
    return isValid ? true : false;
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container justifyContent="center" marginTop={2} marginBottom={2}>
        <Grid container justifyContent="center" width="75%">
          <Typography variant="h4">New Movie </Typography>
          <Grid container>
            {errors.form && <Alert severity="warning">{errors.form}</Alert>}
            {fieldsFilled.title && errors.title && (
              <Alert severity="warning">{errors.title}</Alert>
            )}
          </Grid>
          <TextField
            fullWidth
            margin="normal"
            type="text"
            id="title"
            label="Title"
            value={newMovie.title}
            onChange={(event) => {
              setNewMovie((movie) => ({ ...movie, title: event.target.value }));
              validateField('title', validateTitle, event.target.value);
            }}
            onBlur={(event) => {
              setFieldsFilled((fields) => ({ ...fields, title: true }));
              validateField('title', validateTitle, event.target.value);
            }}
          />
          <Grid container>
            {fieldsFilled.dailyRentalRate && errors.dailyRentalRate && (
              <Alert severity="warning">{errors.dailyRentalRate}</Alert>
            )}
          </Grid>
          <TextField
            fullWidth
            margin="normal"
            type="number"
            id="dailyRentalRate"
            label="Daily Rental Rate"
            value={newMovie.dailyRentalRate}
            onChange={(event) => {
              setNewMovie({
                ...newMovie,
                dailyRentalRate: event.target.value,
              });
              validateField(
                'dailyRentalRate',
                validateRentalRate,
                event.target.value
              );
            }}
            onBlur={(event) => {
              setFieldsFilled((fields) => ({
                ...fields,
                dailyRentalRate: true,
              }));
              validateField(
                'dailyRentalRate',
                validateRentalRate,
                event.target.value
              );
            }}
          />
          <Grid container>
            {fieldsFilled.numberInStock && errors.numberInStock && (
              <Alert severity="warning">{errors.numberInStock}</Alert>
            )}
          </Grid>
          <TextField
            fullWidth
            margin="normal"
            type="number"
            id="numberInStock"
            label="Number In Stock"
            value={newMovie.numberInStock}
            onChange={(event) => {
              setNewMovie({
                ...newMovie,
                numberInStock: event.target.value,
              });
              validateField(
                'numberInStock',
                validateNumInStock,
                event.target.value
              );
            }}
            onBlur={(event) => {
              setFieldsFilled((fields) => ({ ...fields, numberInStock: true }));
              validateField(
                'numberInStock',
                validateNumInStock,
                event.target.value
              );
            }}
          />
          <Grid container>
            {fieldsFilled.genres && errors.genres && (
              <Alert severity="warning">{errors.genres}</Alert>
            )}
          </Grid>
          <FormControl fullWidth margin="normal">
            <InputLabel id="select-label">Genres</InputLabel>
            <Select
              multiple
              labelId="select-label"
              input={<OutlinedInput label="Genres" />}
              value={selectedGenres}
              onChange={(event) => {
                setSelectedGenres(event.target.value);
                validateField('genres', validateGenres, event.target.value);
              }}
              onBlur={(event) => {
                setFieldsFilled((fields) => ({ ...fields, genres: true }));
                validateField('genres', validateGenres, event.target.value);
              }}
            >
              {genres.map((genre) => (
                <MenuItem key={genre._id} value={genre}>
                  {genre.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Grid container justifyContent="center" margin={2}>
            <Button type="submit" variant="contained" size="large">
              Add Movie
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
};

export default MovieForm;
