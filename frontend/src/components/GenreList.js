import React from 'react';
import { Grid, List, ListItem, Chip } from '@mui/material';

const GenreList = (props) => {
  const { genres } = props;

  return (
    <List>
      <Grid container justifyContent="center">
        {genres.map((genre) => (
          <Grid item key={genre._id}>
            <ListItem>
              <Chip label={genre.name} />
            </ListItem>
          </Grid>
        ))}
      </Grid>
    </List>
  );
};

export default GenreList;
