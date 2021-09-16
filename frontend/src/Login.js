import React, { useState } from 'react';
import { TextField } from '@material-ui/core';
import { login } from './util/request';
import AuthDialog from './components/AuthDialog';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = async () => {
    const body = { email, password };
    try {
      const data = await login(body);
      if (typeof data === 'string') {
        alert(data);
        return false;
      }
    } catch (e) {
      console.error(e);
    }
    return true;
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
  };

  return (
    <AuthDialog
      title="Login"
      text="Enter your email address and password to log in."
      submit={submit}
      resetForm={resetForm}
    >
      <TextField
        autoFocus
        fullWidth
        margin="dense"
        type="email"
        id="email"
        label="Email Address"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <TextField
        fullWidth
        margin="dense"
        type="password"
        id="password"
        label="Password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
    </AuthDialog>
  );
};

export default Login;
