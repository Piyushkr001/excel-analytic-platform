// src/pages/Dashboard.jsx
import { Outlet } from 'react-router-dom';
import Layout from '../components/Layout';
import { jwtDecode } from 'jwt-decode'; 

export default function Dashboard() {
  const token = localStorage.getItem('token');
  let role = 'user';

  if (token) {
    try {
      const decoded = jwtDecode(token); // Corrected function name
      role = decoded.role || 'user';
    } catch (err) {
      console.error('Token decode failed:', err);
    }
  }

  return (
    <Layout role={role}>
      <Outlet />
    </Layout>
  );
}