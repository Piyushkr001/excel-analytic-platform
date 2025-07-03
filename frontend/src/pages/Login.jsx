import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import toast from 'react-hot-toast';

import {
  Paper,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from '@mui/material';

import LoginIcon from '@mui/icons-material/Login';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error('Please fill in both fields');
      return;
    }

    try {
      setLoading(true);
      const res = await login(form);
      localStorage.setItem('token', res.data.token);
      toast.success('You Have Logged In Successfully 👏');
      navigate('/dashboard');
    } catch (err) {
      const message = err?.response?.data?.error || 'Login failed. Server is not responding.';
      toast.error(message);
    } finally {
      setLoading(false);
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
            <Typography
              variant="h5"
              sx={{ color: 'success.main', fontWeight: 'bold', textAlign: 'center', mb: 3 }}
            >
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
                startIcon={!loading && <LoginIcon />}
                disabled={loading}
                sx={{
                  mt: 2,
                  backgroundColor: 'success.main',
                  '&:hover': { backgroundColor: 'success.dark' },
                  py: 1.3,
                  fontWeight: 'bold',
                  fontSize: '1rem',
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
              </Button>
            </form>

            <Typography
              variant="body2"
              align="right"
              sx={{ mt: 2, color: 'primary.main', cursor: 'pointer' }}
              onClick={() => navigate('/forgot-password')}
            >
              Forgot Password?
            </Typography>

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
