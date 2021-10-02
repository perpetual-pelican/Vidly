import React from 'react';
import { Grid, List, ListItem, Chip } from '@mui/material';

const MovieList = (props) => {
  const { movies } = props;

  return (
    <List>
      <Grid container justifyContent="center">
        {movies.map((movie) => (
          <Grid item key={movie._id}>
            <ListItem>
              <Chip label={movie.title} />
            </ListItem>
          </Grid>
        ))}
      </Grid>
    </List>
  );
};

export default MovieList;
