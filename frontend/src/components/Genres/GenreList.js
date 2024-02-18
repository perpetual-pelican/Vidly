import React from 'react';
import { Grid, List, ListItem } from '@mui/material';
import GenreChip from './GenreChip';

const GenreList = (props) => {
  const { genres, handleDelete, movies, user } = props;

  genres.forEach(
    (genre) =>
      (genre.movies = movies.filter((movie) => movie.genres[genre._id]))
  );

  return (
    <List>
      <Grid container justifyContent="center">
        {genres.map((genre) => (
          <Grid item key={genre._id}>
            <ListItem>
              <Grid item>
                <GenreChip
                  genre={genre}
                  handleDelete={handleDelete}
                  user={user}
                />
              </Grid>
            </ListItem>
          </Grid>
        ))}
      </Grid>
    </List>
  );
};

export default GenreList;
