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
