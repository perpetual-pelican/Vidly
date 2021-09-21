import React, { useState } from 'react';
import { TextField, Alert } from '@mui/material';
import { register } from './util/request';
import AuthDialog from './components/AuthDialog';
import { user as bounds } from './util/modelConstraints';
const {
  validateName,
  validateEmail,
  validatePassword,
  validatePasswordMatch,
} = require('./util/userValidators');

const errorMessages = {
  name: `Name must be between ${bounds.name.min} and ${bounds.name.max} characters`,
  email: `Please enter a valid email`,
  password: `Password must be between ${bounds.password.min} and ${bounds.password.max} characters and include 1 lowercase, 1 uppercase, 1 number, and 1 symbol`,
  confirmPassword: 'Passwords must match',
};

const Signup = () => {
  const [fields, setFields] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [formIsValid, setFormIsValid] = useState(false);

  const submit = async () => {
    if (!formIsValid) return false;
    const body = {
      name: fields.name,
      email: fields.email,
      password: fields.password,
    };
    try {
      const data = await register(body);
      if (typeof data === 'string') {
        setErrors((errors) => ({ ...errors, form: data }));
        return false;
      } else {
        setErrors((errors) => {
          delete errors.form;
          return errors;
        });
      }
    } catch (e) {
      console.error(e);
    }
    return true;
  };

  const resetForm = () => {
    setFields({ name: '', email: '', password: '', confirmPassword: '' });
    setErrors({});
    setFormIsValid(false);
  };

  const validate = (field, validator, value, value2) => {
    const { error } = validator(value, value2);
    if (error) {
      setErrors((errors) => {
        errors[field] = errorMessages[field];
        return errors;
      });
      setFormIsValid(false);
    } else if (errors[field]) {
      setErrors((errors) => {
        delete errors[field];
        validateForm(errors);
        return errors;
      });
    }
  };

  const validateForm = (errors) => {
    const filledFieldCount = Object.keys(fields).length - 4;
    const isFilled = filledFieldCount >= 3 ? true : false;
    const hasError =
      errors.name || errors.email || errors.password || errors.confirmPassword;
    if (!isFilled || hasError) {
      console.log(filledFieldCount);
      console.log(errors);
      setFormIsValid(false);
    } else {
      setFormIsValid(true);
    }
  };

  return (
    <AuthDialog
      title="Signup"
      text="Enter your name, email address, and password to create an account."
      submit={submit}
      resetForm={resetForm}
      submitDisabled={!formIsValid}
    >
      {errors.form ? <Alert severity="warning">{errors.form}</Alert> : null}
      {fields.nameIsFilled && errors.name ? (
        <Alert severity="warning">{errors.name}</Alert>
      ) : null}
      <TextField
        autoFocus
        required
        fullWidth
        margin="dense"
        type="text"
        id="name"
        label="Name"
        value={fields.name}
        onChange={(event) => {
          setFields((fields) => ({ ...fields, name: event.target.value }));
          validate('name', validateName, event.target.value);
        }}
        onBlur={(event) => {
          setFields((fields) => ({ ...fields, nameIsFilled: true }));
          validate('name', validateName, event.target.value);
        }}
      />
      {fields.emailIsFilled && errors.email ? (
        <Alert severity="warning">{errors.email}</Alert>
      ) : null}
      <TextField
        required
        fullWidth
        margin="dense"
        type="email"
        id="email"
        label="Email Address"
        value={fields.email}
        onChange={(event) => {
          setFields((fields) => ({ ...fields, email: event.target.value }));
          validate('email', validateEmail, event.target.value);
        }}
        onBlur={(event) => {
          setFields((fields) => ({ ...fields, emailIsFilled: true }));
          validate('email', validateEmail, event.target.value);
        }}
      />
      {fields.passwordIsFilled && errors.password ? (
        <Alert severity="warning">{errors.password}</Alert>
      ) : null}
      <TextField
        required
        fullWidth
        margin="dense"
        type="password"
        id="password"
        label="Password"
        value={fields.password}
        onChange={(event) => {
          setFields((fields) => ({ ...fields, password: event.target.value }));
          validate('password', validatePassword, event.target.value);
          validate(
            'confirmPassword',
            validatePasswordMatch,
            event.target.value,
            fields.confirmPassword
          );
        }}
        onBlur={(event) => {
          setFields((fields) => ({ ...fields, passwordIsFilled: true }));
          validate('password', validatePassword, event.target.value);
          validate(
            'confirmPassword',
            validatePasswordMatch,
            event.target.value,
            fields.confirmPassword
          );
        }}
      />
      {fields.confirmPasswordIsFilled && errors.confirmPassword ? (
        <Alert severity="warning">{errors.confirmPassword}</Alert>
      ) : null}
      <TextField
        required
        fullWidth
        margin="dense"
        type="password"
        id="confirm password"
        label="Confirm Password"
        value={fields.confirmPassword}
        onChange={(event) => {
          setFields((fields) => ({
            ...fields,
            confirmPassword: event.target.value,
            confirmPasswordIsFilled: true,
          }));
          validate(
            'confirmPassword',
            validatePasswordMatch,
            fields.password,
            event.target.value
          );
        }}
      />
    </AuthDialog>
  );
};

export default Signup;
