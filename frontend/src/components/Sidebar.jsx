import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiUpload, FiClock, FiShield } from 'react-icons/fi';

const menuItems = [
  { text: 'Dashboard', path: '/dashboard', icon: <FiHome /> },
  { text: 'Upload File', path: '/dashboard/upload', icon: <FiUpload /> },
  { text: 'History', path: '/dashboard/history', icon: <FiClock /> },
  { text: 'Admin Panel', path: '/dashboard/admin', icon: <FiShield />, role: 'admin' },
];

const Sidebar = ({ role, sidebarOpen, setSidebarOpen }) => {
  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:static z-50 md:z-0 w-64 bg-white shadow-lg h-full transition-transform transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="p-4 font-bold text-xl text-green-600 border-b">Excel Analytics</div>
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems
              .filter(item => !item.role || item.role === role)
              .map(({ text, path, icon }) => (
                <li key={text}>
                  <NavLink
                    to={path}
                    end={path === '/dashboard'} // ✅ only exact match activates 'Dashboard'
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2 rounded text-gray-700 transition ${
                        isActive
                          ? 'bg-green-100 font-semibold text-green-700'
                          : 'hover:bg-gray-100'
                      }`
                    }
                  >
                    <span className="text-lg">{icon}</span>
                    <span>{text}</span>
                  </NavLink>
                </li>
              ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
