import React, { useState } from 'react';
import { TextField, Alert } from '@mui/material';
import { register } from '../../util/request';
import AuthDialog from './AuthDialog';
const {
  validateName,
  validateEmail,
  validatePassword,
  validatePasswordMatch,
} = require('../../util/userValidators');

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
        setErrors((currentErrors) => ({ ...currentErrors, form: data }));
        return false;
      } else {
        setErrors((currentErrors) => {
          delete currentErrors.form;
          return currentErrors;
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

  const validateField = (field, validator, value, value2) => {
    const { error } = validator(value, value2);
    if (error) {
      setErrors((currentErrors) => {
        currentErrors[field] = error.details[0].message;
        return currentErrors;
      });
      setFormIsValid(false);
    } else if (errors[field]) {
      setErrors((currentErrors) => {
        delete currentErrors[field];
        validateForm(currentErrors);
        return currentErrors;
      });
    }
  };

  const validateForm = (currentErrors) => {
    const filledFieldCount = Object.keys(fields).length - 4;
    const isFilled = filledFieldCount >= 3 ? true : false;
    const hasError =
      currentErrors.name ||
      currentErrors.email ||
      currentErrors.password ||
      currentErrors.confirmPassword;
    if (!isFilled || hasError) {
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
          setFields((currentFields) => ({
            ...currentFields,
            name: event.target.value,
          }));
          validateField('name', validateName, event.target.value);
        }}
        onBlur={(event) => {
          setFields((currentFields) => ({
            ...currentFields,
            nameIsFilled: true,
          }));
          validateField('name', validateName, event.target.value);
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
          setFields((currentFields) => ({
            ...currentFields,
            email: event.target.value,
          }));
          validateField('email', validateEmail, event.target.value);
        }}
        onBlur={(event) => {
          setFields((currentFields) => ({
            ...currentFields,
            emailIsFilled: true,
          }));
          validateField('email', validateEmail, event.target.value);
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
          setFields((currentFields) => ({
            ...currentFields,
            password: event.target.value,
          }));
          validateField('password', validatePassword, event.target.value);
          validateField(
            'confirmPassword',
            validatePasswordMatch,
            event.target.value,
            fields.confirmPassword
          );
        }}
        onBlur={(event) => {
          setFields((currentFields) => ({
            ...currentFields,
            passwordIsFilled: true,
          }));
          validateField('password', validatePassword, event.target.value);
          validateField(
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
        id="confirmPassword"
        label="Confirm Password"
        value={fields.confirmPassword}
        onChange={(event) => {
          setFields((currentFields) => ({
            ...currentFields,
            confirmPassword: event.target.value,
            confirmPasswordIsFilled: true,
          }));
          validateField(
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
