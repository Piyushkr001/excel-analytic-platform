import { useState } from 'react';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';

export default function Layout({ children, role = 'user' }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar role={role} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
        {/* Mobile Menu Button */}
        <div className="md:hidden p-4">
          <button
            className="bg-gray-800 text-white px-4 py-2 rounded"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu/>
          </button>
        </div>

        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
