import { useState } from 'react';
import { TextInput, PasswordInput, Button, Alert, Checkbox } from '@mantine/core';
import { useForm, isEmail } from '@mantine/form';
import { useNavigate, Link } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Register = () => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null); 
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      username: '',
      email: '',
      password: '',
      is_admin: false,
    },
    validate: {
      username: (value) => (value.trim().length === 0 ? 'Username is required' : null),
      email: (value) => (isEmail(value) ? null : 'Invalid email'),
      password: (value) => value.length < 3 ? 'Password must be at least 3 characters' : null,
    },
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null); 

    const validationErrors = form.validate();
    if (validationErrors.hasErrors) {
      setError('Please fix the form errors');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.values),
      });

      const data = await response.json(); 

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Set success state with message
      setSuccess('Registration successful! Redirecting to login...');
      
      // Reset form and redirect after delay
      form.reset();
      setTimeout(() => navigate('/login'), 2000);

    } catch (err) {
      setError(err.message);
      setSuccess(null); 
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      <h2>Register</h2>
      {error && <Alert color="red" mb="md">{error}</Alert>}
      {success && (
        <Alert color="green" mb="md">
          {success}
        </Alert>
      )}
      
      <form onSubmit={handleRegister}>
        <TextInput
          label="Username"
          placeholder="Enter your username"
          {...form.getInputProps('username')}
          required
          mb="sm"
        />
        <TextInput
          label="Email"
          placeholder="Enter your email"
          {...form.getInputProps('email')}
          required
          mb="sm"
        />
        <PasswordInput
          label="Password"
          placeholder="Enter your password"
          {...form.getInputProps('password')}
          required
          mb="sm"
        />
        <Checkbox
          label="Register as admin"
          {...form.getInputProps('is_admin', { type: 'checkbox' })}
          mb="md"
        />
        <Button type="submit" fullWidth>
          Register
        </Button>
      </form>
      
      <div style={{ textAlign: 'center', marginTop: 16 }}>
        Already have an account? <Link to="/login">Login</Link>
      </div>
    </div>
  );
};

export default Register;