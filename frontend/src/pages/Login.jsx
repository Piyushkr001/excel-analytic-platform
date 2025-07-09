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
  MenuItem,
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import { jwtDecode } from 'jwt-decode';
import GoogleLoginBtn from '../components/GoogleLoginBtn';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', role: 'user' });
  const [loading, setLoading] = useState(false);

  /* ---------- handlers ---------- */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = form;

    if (!email || !password) return toast.error('Please fill in all fields');

    try {
      setLoading(true);

      /* ---- API login ---- */
      const { data } = await login(form);           // includes role field
      const token = data.token;
      localStorage.setItem('token', token);

      /* ---- decode real role ---- */
      const decoded = jwtDecode(token);
      const trueRole = decoded?.role;

      toast.success('Logged in successfully 👏');

      /* ---- route by real role ---- */
      if (trueRole === 'admin') navigate('/dashboard/admin');
      else navigate('/dashboard');
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  /* ---------- UI ---------- */
  return (
    <section className="min-h-screen grid md:grid-cols-2">
      {/* Left side */}
      <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-green-400 to-teal-500 text-white p-10">
        <h1 className="text-4xl font-bold mb-4">Welcome 👋</h1>
        <p className="text-lg text-center max-w-md">
          Sign in to explore your Excel Analytics dashboard.
        </p>
        <img
          src="/src/assets/Images/login-Illustration-Photoroom.png"
          alt="Login illustration"
          className="w-64 mt-8"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-md">
          <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
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
                type="email"
                fullWidth
              />
              <TextField
                label="Password"
                name="password"
                value={form.password}
                onChange={handleChange}
                type="password"
                fullWidth
              />
              <TextField
                select
                label="Login as"
                name="role"
                value={form.role}
                onChange={handleChange}
                fullWidth
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </TextField>

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

            <Typography align="center" sx={{ mt: 2, mb: 1 }}>
              — Or continue with —
            </Typography>
            <GoogleLoginBtn role={form.role} />

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
