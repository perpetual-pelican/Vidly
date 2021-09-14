import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Signup from './Signup';
import Genres from './Genres.js';
import Movies from './Movies.js';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Route exact path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/genres" component={Genres} />
        <Route path="/movies" component={Movies} />
      </div>
    </BrowserRouter>
  );
}

export default App;
