import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/auth';
import toast from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';
import GoogleLoginBtn from '../components/GoogleLoginBtn'; // ✅ Import Google button

import {
  Paper,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Typography,
  CircularProgress,
} from '@mui/material';

import PersonAddIcon from '@mui/icons-material/PersonAdd';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      toast('You are already logged in!', { icon: '🔒' });
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await register(form);
      const token = res.data.token;
      localStorage.setItem('token', token);

      const decoded = jwtDecode(token);
      const role = decoded?.role;

      toast.success('🎉 Registration successful!');

      setTimeout(() => {
        if (role === 'admin') {
          navigate('/dashboard/admin');
        } else {
          navigate('/dashboard');
        }
      }, 1500);
    } catch (err) {
      console.error('🔴 Register error:', err.response?.data || err.message);
      toast.error(err.response?.data?.error || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen grid grid-cols-1 md:grid-cols-2 items-center bg-gradient-to-br from-blue-100 via-white to-indigo-100">
      {/* Branding Section */}
      <div className="flex flex-col items-center justify-center p-12 bg-gradient-to-br from-blue-500 to-indigo-600 text-white h-full">
        <h1 className="text-4xl font-bold mb-4">Join Us 🎉</h1>
        <p className="text-center text-lg max-w-sm">
          Create an account to access your Excel Analytics Dashboard and unlock insights.
        </p>
        <img
          src="/src/assets/Images/Register-Photoroom.png"
          alt="Register Illustration"
          className="w-64 mt-8"
        />
      </div>

      {/* Form Section */}
      <div className="flex justify-center items-center px-6 py-12 md:py-20">
        <Paper elevation={4} sx={{ p: 4, borderRadius: 4, width: '100%', maxWidth: 400 }}>
          <Typography
            variant="h5"
            sx={{ color: 'primary.main', fontWeight: 'bold', mb: 3, textAlign: 'center' }}
          >
            Create Your Account
          </Typography>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <TextField
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              fullWidth
              autoComplete="name"
              required
            />

            <TextField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              fullWidth
              autoComplete="email"
              required
            />

            <TextField
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              fullWidth
              autoComplete="new-password"
              required
            />

            <FormControl fullWidth required>
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                value={form.role}
                label="Role"
                onChange={handleChange}
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>

            <Button
              type="submit"
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} /> : <PersonAddIcon />}
              disabled={loading}
              sx={{
                mt: 2,
                py: 1.2,
                fontWeight: 'bold',
                fontSize: '1rem',
              }}
              fullWidth
            >
              {loading ? 'Registering...' : 'Register'}
            </Button>
          </form>

          {/* — Or use Google — */}
          <Typography align="center" sx={{ mt: 2, mb: 1 }}>
            — Or continue with —
          </Typography>
          <GoogleLoginBtn role={form.role} /> {/* ✅ Google Button */}

          <Typography variant="body2" align="center" sx={{ mt: 3 }}>
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 hover:underline">Login</a>
          </Typography>
        </Paper>
      </div>
    </section>
  );
}
