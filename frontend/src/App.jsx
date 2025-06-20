import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Footer from './components/Footer';

function App() {
  // const isAuthenticated = !!localStorage.getItem('token');

  return (
    <>
      <Navbar />
      <div className="pt-16">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard" element ={<Dashboard/>}
            // element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
          />
        </Routes>
        <Footer/>
      </div>
    </>
  );
}

export default App;
