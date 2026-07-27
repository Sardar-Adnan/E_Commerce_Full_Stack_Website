import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const adminLinks = [
  { to: '/admin/orders', label: 'Orders', icon: '📦' },
  { to: '/admin/inventory', label: 'Inventory', icon: '📋' },
  { to: '/admin/customers', label: 'Customers', icon: '👥' },
];

export default function AdminLayout() {
  const { isAdmin, loading, isAuthenticated } = useAuth();

  if (loading) return <LoadingSpinner text="Loading..." />;
  if (!isAuthenticated || !isAdmin) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white hidden lg:flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <NavLink to="/" className="flex items-center gap-2">
            <span className="text-xl">🌿</span>
            <span className="font-bold text-lg">Leaf & Bloom</span>
          </NavLink>
          <p className="text-xs text-gray-400 mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {adminLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-primary-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <span>{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <NavLink to="/" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
            ← Back to Store
          </NavLink>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar for mobile */}
        <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🌿</span>
            <span className="font-bold text-primary-800">Admin</span>
          </div>
          <div className="flex gap-2">
            {adminLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg text-xs font-medium ${
                    isActive ? 'bg-primary-600 text-white' : 'text-gray-600 bg-gray-100'
                  }`
                }
              >
                {link.icon} {link.label}
              </NavLink>
            ))}
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
