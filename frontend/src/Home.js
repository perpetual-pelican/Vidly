import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import Login from './Login';
import Signup from './Signup';
import Genres from './Genres';
import Movies from './Movies';

const Home = () => {
  const token = sessionStorage.getItem('token');

  return (
    <>
      <AppBar>
        <Toolbar>
          <Typography variant="h4" sx={{ flexGrow: 1 }}>
            Vidly
          </Typography>
          {token && (
            <Button
              color="inherit"
              onClick={() => {
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
