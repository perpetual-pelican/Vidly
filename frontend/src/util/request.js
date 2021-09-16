import axios from 'axios';

axios.interceptors.request.use(async function (config) {
  const token = sessionStorage.getItem('token');
  config.headers['x-auth-token'] = token;
  config.validateStatus = (status) => {
    return status >= 200 && status < 500;
  };
  return config;
});

export async function register(body) {
  const res = await axios.post('/api/users', body);
  sessionStorage.setItem('token', res.headers['x-auth-token']);
  return res.data;
}

export async function login(body) {
  const res = await axios.post('/api/login', body);
  sessionStorage.setItem('token', res.headers['x-auth-token']);
  return res.data;
}

export async function fetchGenres(setGenres) {
  try {
    const res = await axios.get('/api/genres');
    setGenres(res.data);
  } catch (e) {
    console.error(e);
  }
}

export async function postGenre(body) {
  const res = await axios.post('/api/genres', body);
  return res.data;
}

export async function fetchMovies(setMovies) {
  try {
    const res = await axios.get('/api/movies');
    setMovies(res.data);
  } catch (e) {
    console.error(e);
  }
}

export async function postMovie(body) {
  const res = await axios.post('/api/movies', body);
  return res.data;
}
