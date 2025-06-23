import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';

import {
  Paper,
  TextField,
  Button,
  Typography,
} from '@mui/material';

import LoginIcon from '@mui/icons-material/Login';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(form);
      localStorage.setItem('token', res.data.token);
      alert('Login successful!');
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      const message = err?.response?.data?.error || 'Login failed. Please check your credentials.';
      alert(message);
    }
  };

  return (
    <section className="min-h-screen grid md:grid-cols-2">
      {/* Left Section */}
      <div className="md:flex flex-col items-center justify-center bg-gradient-to-br from-green-400 to-teal-500 text-white p-10">
        <h1 className="text-4xl font-bold mb-4">Welcome 👋</h1>
        <p className="text-lg text-center max-w-md">
          Sign in to explore your Excel Analytics Dashboard and gain valuable insights.
        </p>
        <img
          src="/src/assets/Images/login-Illustration-Photoroom.png"
          alt="Login Illustration"
          className="w-64 mt-8"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-md">
          <Paper elevation={4} sx={{ padding: 4, borderRadius: 4 }}>
            <Typography variant="h5" sx={{ color: 'success.main', fontWeight: 'bold', textAlign: 'center', mb: 3 }}>
              Sign in to your account
            </Typography>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <TextField
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                type="email"
                fullWidth
                variant="outlined"
                autoComplete="email"
              />

              <TextField
                label="Password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                type="password"
                fullWidth
                variant="outlined"
                autoComplete="current-password"
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                startIcon={<LoginIcon />}
                sx={{
                  mt: 2,
                  backgroundColor: 'success.main',
                  '&:hover': { backgroundColor: 'success.dark' },
                  py: 1.3,
                  fontWeight: 'bold',
                  fontSize: '1rem',
                }}
              >
                Login
              </Button>
            </form>

            <Typography variant="body2" align="center" sx={{ mt: 3 }}>
              Don&apos;t have an account?{' '}
              <a href="/register" className="text-green-600 hover:underline">
                Register
              </a>
            </Typography>
          </Paper>
        </div>
      </div>
    </section>
  );
}
