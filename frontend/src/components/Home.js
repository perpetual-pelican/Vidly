import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  Typography,
  Button,
  Grid,
} from '@mui/material';
import Login from './Auth/Login';
import Signup from './Auth/Signup';
import Genres from './Genres/Genres';
import Movies from './Movies/Movies';
import { fetchUser, fetchGenres, fetchMovies } from '../util/request';

const TabPanel = (props) => {
  const { children, value, index, title } = props;
  return (
    <>
      {value === index && (
        <Grid
          container
          role="tabpanel"
          hidden={value !== index}
          id={`tabpanel-${index}`}
          aria-labelledby={`tab-${index}`}
          maxWidth="90%"
          flexDirection="column"
        >
          <Grid container justifyContent="center" marginBottom={2}>
            <Typography variant="h3">{title}</Typography>
          </Grid>
          <Grid container>{children}</Grid>
        </Grid>
      )}
    </>
  );
};

const Home = () => {
  const [user, setUser] = useState();
  const [genres, setGenres] = useState([]);
  const [movies, setMovies] = useState([]);
  const [token, setToken] = useState(sessionStorage.getItem('token'));
  const [currentTab, setCurrentTab] = useState(0);

  useEffect(() => {
    if (token) fetchUser(setUser);
    fetchGenres(setGenres);
    fetchMovies(setMovies);
  }, [token]);

  return (
    <Grid container height="97vh">
      <AppBar>
        <Toolbar>
          <Typography variant="h4">Vidly</Typography>
          <Tabs
            value={currentTab}
            onChange={(event, newTab) => {
              setCurrentTab(newTab);
            }}
            aria-label="tabs"
            textColor="secondary"
            indicatorColor="secondary"
            centered
            sx={{ flexGrow: 1 }}
          >
            <Tab
              label="Genres"
              value={0}
              id="tab-0"
              aria-controls="tabpanel-0"
            />
            <Tab
              label="Movies"
              value={1}
              id="tab-1"
              aria-controls="tabpanel-1"
            />
          </Tabs>
          {user && (
            <Button
              color="inherit"
              onClick={() => {
                sessionStorage.removeItem('token');
                setToken(null);
                setUser(null);
              }}
            >
              Logout
            </Button>
          )}
          {!user && (
            <>
              <Login setToken={setToken} />
              <Signup setToken={setToken} />
            </>
          )}
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Grid container justifyContent="center" maxHeight="70%">
        <TabPanel value={currentTab} index={0} title="Genres">
          <Genres
            genres={genres}
            setGenres={setGenres}
            movies={movies}
            user={user}
          />
        </TabPanel>
        <TabPanel value={currentTab} index={1} title="Movies">
          <Movies
            movies={movies}
            setMovies={setMovies}
            genres={genres}
            user={user}
          />
        </TabPanel>
      </Grid>
      <Grid container />
    </Grid>
  );
};

export default Home;
