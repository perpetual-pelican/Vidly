import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  makeStyles,
} from '@material-ui/core';
import Login from './Login';
import Signup from './Signup';
import Genres from './Genres';
import Movies from './Movies';

const useStyles = makeStyles({
  title: {
    flexGrow: 1,
  },
});

const Home = () => {
  const token = sessionStorage.getItem('token');
  const classes = useStyles();

  return (
    <>
      <AppBar>
        <Toolbar>
          <Typography variant="h4" className={classes.title}>
            Vidly
          </Typography>
          {token && (
            <Button
              color="inherit"
              onClick={(event) => {
                event.preventDefault();
                sessionStorage.removeItem('token');
                window.location.reload(false);
              }}
            >
              Logout
            </Button>
          )}
          {!token && (
            <>
              <Login />
              <Signup />
            </>
          )}
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Genres />
      <Movies />
    </>
  );
};

export default Home;
