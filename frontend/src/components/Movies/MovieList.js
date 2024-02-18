import React from 'react';
import { Grid, List, ListItem, Chip, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const MovieList = ({ movies, shift }) => {
  const theme = useTheme();
  const isLgUp = useMediaQuery(theme.breakpoints.up('lg'));
  const isXlUp = useMediaQuery(theme.breakpoints.up('xl'));

  const colShift = shift ? -1 : 0;
  let numColumns = 1;
  if (movies.length < 3) numColumns = movies.length;
  else if (isXlUp) numColumns = 3 + colShift;
  else if (isLgUp) numColumns = 2 + colShift;

  let colSize = Math.ceil(movies.length / numColumns);
  const cols = [];
  // split movies into columns for UI layout
  for (let i = 0; i < numColumns; i++) {
    cols[i] = movies.slice(colSize * i, (i + 1) * colSize);
    if (i === 0 && numColumns === 3 && movies.length % numColumns === 1)
      colSize--;
  }
  // alternate way of splitting movies
  // for (let i = 0; i < movies.length; i++) {
  //   if (i < numColumns) cols.push([movies[i]]);
  //   else cols[i % numColumns].push(movies[i]);
  // }

  return (
    <>
      {cols.map(
        (col) =>
          col.length > 0 && (
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
          )
      )}
    </>
  );
};

export default MovieList;
