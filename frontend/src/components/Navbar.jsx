import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GiHamburgerMenu } from 'react-icons/gi';
import { AiOutlineClose } from 'react-icons/ai';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <nav className="w-full bg-white shadow-md fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* ✅ Fixed Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/src/assets/Logo/logo.svg" // <- Ensure this file is in your /public directory
              alt="Xcellytics Logo"
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link to="/" className="text-gray-700 hover:text-green-600 transition">Home</Link>
            <Link to="/dashboard" className="text-gray-700 hover:text-green-600 transition">Dashboard</Link>
            <Link to="/features" className="text-gray-700 hover:text-green-600 transition">Features</Link>
            <Link to="/about" className="text-gray-700 hover:text-green-600 transition">About Us</Link>
            <Link to="/contact" className="text-gray-700 hover:text-green-600 transition">Contact</Link>

            {!isAuthenticated ? (
              <>
                <Link to="/login" className="text-green-600 font-medium hover:underline">Login</Link>
                <Link
                  to="/register"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Register
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="text-red-600 font-medium hover:underline"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-2xl text-green-700 focus:outline-none"
          >
            {menuOpen ? <AiOutlineClose /> : <GiHamburgerMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white px-4 pt-2 pb-4 shadow-md space-y-2">
          <Link to="/" className="block text-gray-700 hover:text-green-600">Home</Link>
          <Link to="/dashboard" className="block text-gray-700 hover:text-green-600">Dashboard</Link>
          <Link to="/features" className="block text-gray-700 hover:text-green-600">Features</Link>
          <Link to="/contact" className="block text-gray-700 hover:text-green-600">Contact</Link>

          {!isAuthenticated ? (
            <>
              <Link to="/login" className="block text-green-700 font-semibold">Login</Link>
              <Link
                to="/register"
                className="block bg-green-600 text-white text-center py-2 rounded-lg hover:bg-green-700"
              >
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="block text-red-600 text-left font-semibold w-full"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
