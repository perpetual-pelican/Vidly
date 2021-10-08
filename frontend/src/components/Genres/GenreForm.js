import React, { useState } from 'react';
import { Grid, TextField, Button } from '@mui/material';
import { postGenre } from '../../util/request';

const GenreForm = (props) => {
  const { genres, setGenres } = props;
  const [newGenre, setNewGenre] = useState('');

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const data = await postGenre({ name: newGenre });
      if (typeof data === 'string') {
        alert(data);
        return;
      }
      setGenres([data, ...genres]);
      setNewGenre('');
    } catch (e) {
      alert(e);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        marginTop={2}
        marginBottom={2}
      >
        <TextField
          type="text"
          id="genre"
          label="Genre Name"
          value={newGenre}
          onChange={(event) => setNewGenre(event.target.value)}
        />
        <Button
          type="submit"
          variant="contained"
          size="large"
          sx={{ margin: 2 }}
        >
          Add Genre
        </Button>
      </Grid>
    </form>
  );
};

export default GenreForm;
