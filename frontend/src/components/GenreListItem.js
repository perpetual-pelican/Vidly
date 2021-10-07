import React, { useState } from 'react';
import { Grid, List, ListItem, Chip, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const GenreListItem = ({ genre }) => {
  const theme = useTheme();
  const [showMovies, setShowMovies] = useState(false);

  return (
    <ListItem>
      <Grid item>
        <Chip
          color={showMovies ? 'primary' : 'default'}
          label={genre.name}
          onClick={() => {
            setShowMovies((show) => !show);
          }}
          sx={{ fontSize: 16 }}
        />
        {showMovies && (
          <List
            sx={{
              border: 2,
              borderColor: theme.palette.primary.main,
              borderRadius: 5,
            }}
          >
            {genre.movies.length > 0 ? (
              genre.movies.map((movie) => (
                <ListItem key={movie._id}>
                  <Typography>{movie.title}</Typography>
                </ListItem>
              ))
            ) : (
              <ListItem>
                <Typography color="error">No Movies Found</Typography>
              </ListItem>
            )}
          </List>
        )}
      </Grid>
    </ListItem>
  );
};

export default GenreListItem;
