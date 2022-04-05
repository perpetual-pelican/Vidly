import React, { useState } from 'react';
import { Grid, TextField, Button, Alert } from '@mui/material';
import { postGenre } from '../../util/request';
const { validateName } = require('../../util/validators/genreValidators');

const GenreForm = (props) => {
  const { setGenres } = props;
  const [newGenre, setNewGenre] = useState('');
  const [formError, setFormError] = useState('');
  const [isFilled, setIsFilled] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsFilled(true);
    const isValid = validate(newGenre);
    if (!isValid) return;
    try {
      const data = await postGenre({ name: newGenre });
      if (typeof data === 'string') {
        setFormError(data);
        return;
      }
      setGenres((genres) =>
        [data, ...genres].sort(function (genre1, genre2) {
          return genre1.name < genre2.name ? -1 : 1;
        })
      );
      setNewGenre('');
      setFormError('');
    } catch (e) {
      alert(e);
    }
  };

  const validate = (name) => {
    const { error } = validateName(name);
    if (error) {
      setFormError(error.details[0].message);
      return false;
    }
    setFormError('');
    return true;
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        marginTop={2}
        marginBottom={2}
      >
        <Grid container justifyContent="center">
          {isFilled && formError && (
            <Alert severity="warning">{formError}</Alert>
          )}
        </Grid>
        <TextField
          type="text"
          id="genre"
          label="Genre Name"
          value={newGenre}
          onChange={(event) => {
            setNewGenre(event.target.value);
            if (isFilled) validate(event.target.value);
          }}
          onBlur={(event) => {
            if (!event.target.value) setFormError('');
          }}
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
