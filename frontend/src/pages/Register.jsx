import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/auth';

import {
  Paper,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Typography,
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

  const roles = ['user', 'admin'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await register(form);
      localStorage.setItem('token', res.data.token);
      alert('Registration successful!');
      navigate('/dashboard');
    } catch (err) {
      console.error('🔴 Register error:', err.response?.data || err.message);
      alert(err.response?.data?.error || 'Registration failed. Try again.');
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-indigo-100 grid grid-cols-1 md:grid-cols-2 items-center justify-center">
      {/* Left Branding Section */}
      <div className="md:flex flex-col items-center justify-center h-full p-12 bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
        <h1 className="text-4xl font-bold mb-4">Join Us 🎉</h1>
        <p className="text-center text-lg leading-relaxed max-w-sm">
          Create an account to access your Excel Analytics Dashboard and unlock insights.
        </p>
        <img
          src="/src/assets/Images/Register-Photoroom.png"
          alt="Register Illustration"
          className="w-64 mt-8"
        />
      </div>

      {/* Right Form Section */}
      <div className="flex justify-center items-center px-6 py-10 md:py-20">
        <div className="w-full max-w-md">
          <Paper elevation={4} sx={{ padding: 4, borderRadius: 4 }}>
            <Typography
              variant="h5"
              sx={{ color: 'primary.main', fontWeight: 'bold', textAlign: 'center', mb: 3 }}
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
                variant="outlined"
                autoComplete="name"
              />

              <TextField
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                fullWidth
                variant="outlined"
                autoComplete="email"
              />

              <TextField
                label="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                fullWidth
                variant="outlined"
                autoComplete="new-password"
              />

              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  name="role"
                  value={form.role}
                  label="Role"
                  onChange={handleChange}
                >
                  {roles.map((role) => (
                    <MenuItem key={role} value={role}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                startIcon={<PersonAddIcon />}
                sx={{
                  mt: 2,
                  backgroundColor: '#1976d2',
                  '&:hover': { backgroundColor: '#115293' },
                  py: 1.3,
                  fontWeight: 'bold',
                  fontSize: '1rem',
                }}
              >
                Register
              </Button>
            </form>

            <Typography variant="body2" align="center" sx={{ mt: 3 }}>
              Already have an account?{' '}
              <a href="/login" className="text-blue-600 hover:underline">Login</a>
            </Typography>
          </Paper>
        </div>
      </div>
    </section>
  );
}
