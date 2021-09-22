import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';

const AuthDialog = (props) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    props.resetForm();
  };

  const handleSubmit = async () => {
    const success = await props.submit();
    if (success) {
      handleClose();
      window.location.reload(false);
    }
  };

  return (
    <>
      <Button color="inherit" onClick={handleClickOpen}>
        {props.title}
      </Button>
      <Dialog
        aria-labelledby="dialog-title"
        open={open}
        onClose={handleClose}
        onKeyUp={(event) => {
          const ENTER = 13;
          if (event.keyCode === ENTER) handleSubmit();
        }}
      >
        <DialogTitle id="dialog-title">{props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{props.text}</DialogContentText>
          {props.children}
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={handleSubmit}
            disabled={props.submitDisabled}
          >
            {props.title}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AuthDialog;
