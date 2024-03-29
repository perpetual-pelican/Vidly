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
  if (res.headers['x-auth-token']) {
    sessionStorage.setItem('token', res.headers['x-auth-token']);
  }
  return res.data;
}

export async function login(body) {
  const res = await axios.post('/api/login', body);
  if (res.headers['x-auth-token']) {
    sessionStorage.setItem('token', res.headers['x-auth-token']);
  }
  return res.data;
}

export async function fetchUser(setUser) {
  try {
    const res = await axios.get('/api/users/me');
    setUser(res.data);
  } catch (e) {
    console.error(e);
  }
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

export async function deleteGenre(id) {
  try {
    const res = await axios.delete(`/api/genres/${id}`);
    return res.data;
  } catch (e) {
    console.error(e);
  }
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
