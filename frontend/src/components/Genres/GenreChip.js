import React, { useState } from 'react';
import { List, ListItem, Chip, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const GenreListItem = ({ genre }) => {
  const theme = useTheme();
  const [showMovies, setShowMovies] = useState(false);

  return (
    <>
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
            borderRadius: 5,
            borderColor: theme.palette.primary.main,
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
    </>
  );
};

export default GenreListItem;
