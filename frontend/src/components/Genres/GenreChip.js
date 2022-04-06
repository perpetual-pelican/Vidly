import React, { useState } from 'react';
import { List, ListItem, Chip, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ClearIcon from '@mui/icons-material/Clear';
import GenreDeleteModal from './GenreDeleteModal';

const GenreChip = ({ genre, handleDelete, user }) => {
  const theme = useTheme();
  const [showMovies, setShowMovies] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  return (
    <>
      <Chip
        color={showMovies ? 'primary' : 'default'}
        label={genre.name}
        onClick={() => {
          setShowMovies((show) => !show);
        }}
        onDelete={
          user?.isAdmin
            ? () => {
                handleModalOpen();
              }
            : null
        }
        deleteIcon={<ClearIcon />}
        sx={{
          fontSize: 16,
          '& .MuiChip-deleteIcon': {
            '&:hover': { color: theme.palette.error.main },
          },
        }}
      />
      <GenreDeleteModal
        open={modalOpen}
        genre={genre}
        handleClose={handleModalClose}
        handleDelete={handleDelete}
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
                <Chip label={movie.title} />
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

export default GenreChip;
