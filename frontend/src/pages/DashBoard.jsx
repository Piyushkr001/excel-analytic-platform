// src/pages/DashBoard.jsx
import { Outlet } from 'react-router-dom';
import Layout from '../components/Layout';

export default function Dashboard() {
  return (
    <Layout>
      <Outlet /> {/* Nested routes like /dashboard/upload, /dashboard/history go here */}
    </Layout>
  );
}
