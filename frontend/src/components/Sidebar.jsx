import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiBox, FiCpu, FiDollarSign, FiLogOut } from 'react-icons/fi';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: FiHome },
  { to: '/products', label: 'Products', icon: FiBox },
  { to: '/ai-generator', label: 'AI Generator', icon: FiCpu },
  { to: '/sales', label: 'Sales', icon: FiDollarSign },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-64 bg-indigo-900 text-white flex flex-col">
      <div className="p-6 border-b border-indigo-800">
        <h1 className="text-xl font-bold">SmartStore AI</h1>
        <p className="text-indigo-300 text-sm mt-1">{user?.storeName || 'My Store'}</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? 'bg-indigo-700 text-white' : 'text-indigo-300 hover:bg-indigo-800 hover:text-white'
              }`
            }
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-indigo-800">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-sm font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="text-sm">
            <p className="font-medium">{user?.name}</p>
            <p className="text-indigo-400 text-xs">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-4 py-2 text-indigo-300 hover:text-white hover:bg-indigo-800 rounded-lg transition-colors"
        >
          <FiLogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
