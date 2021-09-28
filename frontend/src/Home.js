import React, { useState } from 'react';
import { AppBar, Toolbar, Tabs, Tab, Typography, Button } from '@mui/material';
import Login from './Login';
import Signup from './Signup';
import Genres from './Genres';
import Movies from './Movies';

const TabPanel = (props) => {
  const { children, value, index } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
    >
      {value === index && children}
    </div>
  );
};

const Home = () => {
  const token = sessionStorage.getItem('token');
  const [currentTab, setCurrentTab] = useState(0);

  return (
    <>
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
      <Toolbar />
      <TabPanel value={currentTab} index={0}>
        <Genres />
      </TabPanel>
      <TabPanel value={currentTab} index={1}>
        <Movies />
      </TabPanel>
    </>
  );
};

export default Home;
