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
} from '@mui/material';
import { postMovie } from '../util/request';

const MovieForm = (props) => {
  const { movies, setMovies, genres } = props;
  const [newMovie, setNewMovie] = useState({
    title: '',
    dailyRentalRate: 0,
    numberInStock: 0,
  });
  const [selectedGenres, setSelectedGenres] = useState([]);

  const onSubmit = async (event) => {
    event.preventDefault();
    const selectedGenreIds = selectedGenres.map((genre) => genre._id);
    try {
      const data = await postMovie({ ...newMovie, genreIds: selectedGenreIds });
      if (typeof data === 'string') {
        alert(data);
        return;
      }
      setMovies([data, ...movies]);
      setNewMovie({
        title: '',
        dailyRentalRate: 0,
        numberInStock: 0,
      });
      setSelectedGenres([]);
    } catch (e) {
      alert(e);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <Grid container justifyContent="center">
        <Grid container justifyContent="center" width="75%">
          <Typography variant="h4">New Movie: </Typography>
          <TextField
            fullWidth
            margin="normal"
            type="text"
            id="title"
            label="Title"
            value={newMovie.title}
            onChange={(event) =>
              setNewMovie({ ...newMovie, title: event.target.value })
            }
          />
          <TextField
            fullWidth
            margin="normal"
            type="number"
            id="dailyRentalRate"
            label="Daily Rental Rate"
            value={newMovie.dailyRentalRate}
            onChange={(event) =>
              setNewMovie({
                ...newMovie,
                dailyRentalRate: event.target.value,
              })
            }
          />
          <TextField
            fullWidth
            margin="normal"
            type="number"
            id="numberInStock"
            label="Number In Stock"
            value={newMovie.numberInStock}
            onChange={(event) =>
              setNewMovie({
                ...newMovie,
                numberInStock: event.target.value,
              })
            }
          />
          <FormControl fullWidth>
            <InputLabel id="select-label">Genres</InputLabel>
            <Select
              multiple
              fullWidth
              labelId="select-label"
              input={<OutlinedInput label="Genres" />}
              value={selectedGenres}
              onChange={(event) => {
                setSelectedGenres(event.target.value);
              }}
            >
              {genres.map((genre) => (
                <MenuItem key={genre._id} value={genre}>
                  {genre.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Grid container justifyContent="center" marginTop={2}>
            <Button type="submit" variant="contained">
              Add
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
};

export default MovieForm;
