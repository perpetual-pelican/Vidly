import React, { useState } from 'react';
import { TextField } from '@mui/material';
import { register } from './util/request';
import AuthDialog from './components/AuthDialog';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const submit = async () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    const body = { name, email, password };
    try {
      const data = await register(body);
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
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <AuthDialog
      title="Signup"
      text="Enter your name, email address, and password to create an account."
      submit={submit}
      resetForm={resetForm}
    >
      <TextField
        autoFocus
        fullWidth
        margin="dense"
        type="text"
        id="name"
        label="Name"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <TextField
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
      <TextField
        fullWidth
        margin="dense"
        type="password"
        id="confirm password"
        label="Confirm Password"
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.target.value)}
      />
    </AuthDialog>
  );
};

export default Signup;
