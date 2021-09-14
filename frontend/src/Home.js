import React from 'react';
import { Link } from 'react-router-dom';
import Genres from './Genres';
import Movies from './Movies';

const Home = () => {
  const token = sessionStorage.getItem('token');

  return (
    <>
      <h1>Vidly</h1>
      {token && (
        <div>
          <button
            onClick={(event) => {
              event.preventDefault();
              sessionStorage.removeItem('token');
              window.location.reload(false);
            }}
          >
            Logout
          </button>
        </div>
      )}
      {!token && (
        <>
          <div>
            <Link to="/login">Login</Link>
          </div>
          <div>
            <Link to="/signup">Signup</Link>
          </div>
        </>
      )}
      <Genres />
      <Movies />
    </>
  );
};

export default Home;
