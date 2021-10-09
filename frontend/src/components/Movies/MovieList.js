import React from 'react';
import { Grid, List, ListItem, Chip, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const MovieList = ({ movies, shift }) => {
  const theme = useTheme();
  const isLgUp = useMediaQuery(theme.breakpoints.up('lg'));
  const isXlUp = useMediaQuery(theme.breakpoints.up('xl'));

  const colShift = shift ? -1 : 0;
  let numColumns = 1;
  if (isXlUp) numColumns = 3 + colShift;
  else if (isLgUp) numColumns = 2 + colShift;

  const colSize = Math.ceil(movies.length / numColumns);
  const cols = [];
  for (let i = 0; i < numColumns; i++) {
    cols[i] = movies.slice(colSize * i, (i + 1) * colSize);
  }

  return (
    <>
      {cols.map((col) => (
        <Grid
          key={col[0]._id}
          container
          item
          sm={12 / numColumns}
          justifyContent="center"
        >
          <List>
            {col.map((movie) => (
              <ListItem key={movie._id}>
                <Chip label={movie.title} />
              </ListItem>
            ))}
          </List>
        </Grid>
      ))}
    </>
  );
};

export default MovieList;
