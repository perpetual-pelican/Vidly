import React from 'react';
import { Grid, List, ListItem, Chip, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const MovieList = ({ movies }) => {
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));
  const isLgUp = useMediaQuery(theme.breakpoints.up('lg'));
  const isXlUp = useMediaQuery(theme.breakpoints.up('xl'));

  let numColumns = 1;
  if (isXlUp) numColumns = 4;
  else if (isLgUp) numColumns = 3;
  else if (isSmUp) numColumns = 2;

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
