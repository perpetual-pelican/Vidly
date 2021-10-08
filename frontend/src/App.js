import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { yellow } from '@mui/material/colors';
import Home from './components/Home';

const theme = createTheme({
  palette: {
    secondary: {
      main: yellow[500],
      light: yellow[300],
      dark: yellow[700],
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Home />
    </ThemeProvider>
  );
}

export default App;
