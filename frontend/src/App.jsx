// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/DashBoard'; // Parent layout
import DashboardHome from './pages/DashboardHome'; // ✅ Import the default dashboard child
import Upload from './pages/Upload';
import History from './pages/History';
// import Admin from './pages/Admin';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <>
      <Navbar />
      <div className="pt-16 min-h-screen flex flex-col justify-between">
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

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
              <Route path="upload" element={<Upload />} />
              <Route path="history" element={<History />} />
              {/* <Route path="admin" element={<Admin />} />  */}
            </Route>
          </Routes>
        </div>
        <Footer /> {/* ✅ Footer outside Routes */}
      </div>
    </>
  );
}

export default App;
