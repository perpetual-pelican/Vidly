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
import Login from './Login';
import Signup from './Signup';
import Genres from './Genres';
import Movies from './Movies';
import { fetchGenres, fetchMovies } from './util/request';

const TabPanel = (props) => {
  const { children, value, index } = props;
  return (
    <>
      {value === index && (
        <Grid
          container
          role="tabpanel"
          hidden={value !== index}
          id={`tabpanel-${index}`}
          aria-labelledby={`tab-${index}`}
          justifyContent="center"
          maxWidth="80%"
        >
          {children}
        </Grid>
      )}
    </>
  );
};

const Home = () => {
  const token = sessionStorage.getItem('token');
  const [genres, setGenres] = useState([]);
  const [movies, setMovies] = useState([]);
  const [currentTab, setCurrentTab] = useState(0);

  useEffect(() => {
    fetchGenres(setGenres);
    fetchMovies(setMovies);
  }, []);

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
      <Grid container justifyContent="center" maxHeight="70%" marginTop="8%">
        <TabPanel value={currentTab} index={0}>
          <Genres genres={genres} setGenres={setGenres} />
        </TabPanel>
        <TabPanel value={currentTab} index={1}>
          <Movies movies={movies} setMovies={setMovies} genres={genres} />
        </TabPanel>
      </Grid>
    </Grid>
  );
};

export default Home;
