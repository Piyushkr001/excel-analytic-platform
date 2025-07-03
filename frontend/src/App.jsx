import { Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DashboardHome from './pages/DashboardHome';
import History from './pages/History';
import Admin from './pages/Admin';
import PrivateRoute from './components/PrivateRoute';
import Features from './pages/Features';
import Contact from './pages/Contact';
import UploadAndChart from './pages/UploadAndChart';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import { Toaster } from 'react-hot-toast';

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const isExpired = decoded.exp * 1000 < Date.now();
        if (isExpired) {
          console.warn('⚠️ Token expired. Logging out.');
          localStorage.removeItem('token');
          navigate('/login');
        }
      } catch (err) {
        console.error('❌ Invalid token:', err); // Log the error for debugging
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  }, [navigate]);

  return (
    <>
      <Navbar />
       <Toaster position="top-center" />
      <div className="pt-16 min-h-screen flex flex-col justify-between">
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/features" element={<Features />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />        {/* ✅ new */}
            <Route path="/reset-password/:token" element={<ResetPassword />} />   {/* ✅ new */}


            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            >
              {/* ✅ Nested routes inside Dashboard layout */}
              <Route index element={<DashboardHome />} />
              <Route path="upload" element={<UploadAndChart />} />
              <Route path="history" element={<History />} />
              <Route path="admin" element={<Admin />} />
            </Route>
          </Routes>
        </div>
        <Footer /> {/* ✅ Footer outside Routes */}
      </div>
    </>
  );
}

export default App;