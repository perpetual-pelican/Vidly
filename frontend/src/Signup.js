import React, { useState } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const history = useHistory();

  const token = sessionStorage.getItem('token');
  if (token) return <Redirect to="/" />;

  const onSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const body = { name, email, password };
    try {
      const res = await axios.post('/api/users', body, {
        validateStatus: (status) => status >= 200 && status < 500,
      });
      if (res.status !== 200) {
        alert(res.data);
        return;
      }
      sessionStorage.setItem('token', res.headers['x-auth-token']);
      history.push('/');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <Link to="/">Home</Link>
      <form onSubmit={onSubmit}>
        <div>
          <label>Name: </label>
          <input
            type="text"
            placeholder="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div>
          <label>E-mail: </label>
          <input
            type="email"
            placeholder="e-mail"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div>
          <label>Password: </label>
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <div>
          <label>Confirm Password: </label>
          <input
            type="password"
            placeholder="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
        </div>
        <input type="submit" value="Signup" />
      </form>
    </div>
  );
};

export default Signup;
