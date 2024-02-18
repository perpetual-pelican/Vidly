import React from 'react';
import { Typography, Modal, Box, Button, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const GenreDeleteModal = ({ open, genre, handleClose, handleDelete }) => {
  const theme = useTheme();

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-title" variant="h6" component="h2">
          Delete Genre?
        </Typography>
        <Typography id="modal-description" mt={2}>
          This will{' '}
          <strong>
            <font color={theme.palette.error.main}>permanently delete </font>
          </strong>
          the genre <strong>{genre.name}</strong> and remove it from any
          associated movies. Would you like to continue?
        </Typography>
        <Grid container mt={2} justifyContent="space-between">
          <Button
            onClick={handleClose}
            sx={{
              '&:hover': {
                backgroundColor: theme.palette.action.focus,
              },
            }}
          >
            Cancel
          </Button>
          <Button
            color="error"
            onClick={() => handleDelete(genre)}
            sx={{
              '&:hover': {
                backgroundColor: theme.palette.action.focus,
              },
            }}
          >
            Delete
          </Button>
        </Grid>
      </Box>
    </Modal>
  );
};

export default GenreDeleteModal;
