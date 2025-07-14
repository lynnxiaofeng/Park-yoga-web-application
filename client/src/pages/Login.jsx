import { useState } from 'react';
import { TextInput, PasswordInput, Button, Alert } from '@mantine/core';
import { useForm, isEmail } from '@mantine/form';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Login = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => (isEmail(value) ? null : 'Invalid email'),
      password: (value) =>
        value.length < 3 ? 'Password must be at least 3 characters' : null,
    },
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    const validation = form.validate();
    if (validation.hasErrors) return;

    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.values),
      });
    
      const result = await response.json();
    
      if (!response.ok) {
        throw new Error(result.error || 'Login failed');
      }
    
      // Save token
      localStorage.setItem('token', result.token);
      // Save user info 
      localStorage.setItem('user', JSON.stringify(result.user));
    
      navigate('/');
    } catch (err) {
      setError(err.message);
    }    
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto' }}>
      <h2>Login</h2>
      {error && <Alert color="red">{error}</Alert>}
      <form onSubmit={handleLogin}>
        <TextInput
          label="Email"
          placeholder="Enter your email"
          {...form.getInputProps('email')}
          required
        />
        <PasswordInput
          label="Password"
          placeholder="Enter your password"
          {...form.getInputProps('password')}
          required
          mt="sm"
        />
        <Button type="submit" fullWidth mt="md">
          Login
        </Button>
      </form>
    </div>
  );
};

export default Login;
