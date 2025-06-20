import { useState } from 'react';
import { Menu, BarChart2, LogOut } from 'lucide-react';

const Sidebar = () => {
  const [open, setOpen] = useState(true);

  return (
    <div className={`bg-gray-900 text-white p-4 h-screen ${open ? 'w-64' : 'w-20'} transition-all duration-300`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">{open && 'Dashboard'}</h1>
        <Menu className="cursor-pointer" onClick={() => setOpen(!open)} />
      </div>
      <ul className="space-y-4">
        <li className="flex items-center space-x-2 cursor-pointer hover:text-gray-300">
          <BarChart2 />
          {open && <span>Analytics</span>}
        </li>
        <li className="flex items-center space-x-2 cursor-pointer hover:text-gray-300">
          <LogOut />
          {open && <span>Logout</span>}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
