import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiHome,
  FiAlertCircle,
  FiPlusCircle,
  FiBarChart2,
  FiLogOut,
  FiMenu,
  FiX,
  FiBell,
  FiUser,
} from 'react-icons/fi';
import { GiPowerRing } from 'react-icons/gi';

const Layout = () => {
  const { user, logout, isRanger, isEngineer, isAdmin, isSuperAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleColor = () => {
    if (isSuperAdmin) return 'border-zordon-gold text-zordon-gold';
    if (isAdmin) return 'border-ranger-green text-ranger-green';
    if (isEngineer) return 'border-ranger-blue text-ranger-blue';
    return 'border-ranger-red text-ranger-red';
  };

  const getRoleName = () => {
    if (isSuperAdmin) return 'Zordon (Super Admin)';
    if (isAdmin) return 'Admin';
    if (isEngineer) return 'Engineer';
    return 'Ranger';
  };

  const navItems = [
    { path: '/dashboard', icon: FiHome, label: 'Dashboard', roles: ['all'] },
    { path: '/issues', icon: FiAlertCircle, label: 'Issues', roles: ['all'] },
    {
      path: '/issues/create',
      icon: FiPlusCircle,
      label: 'Create Issue',
      roles: ['ranger', 'admin', 'superadmin'],
    },
    {
      path: '/analytics',
      icon: FiBarChart2,
      label: 'Analytics',
      roles: ['admin', 'superadmin'],
    },
  ];

  const canAccess = (item) => {
    if (item.roles.includes('all')) return true;
    if (isSuperAdmin) return true;
    if (isAdmin && item.roles.includes('admin')) return true;
    if (isEngineer && item.roles.includes('engineer')) return true;
    if (isRanger && item.roles.includes('ranger')) return true;
    return false;
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gray-900/95 backdrop-blur-sm border-r border-gray-800 transition-all duration-300 fixed h-screen`}
      >
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className={`flex items-center space-x-3 ${!sidebarOpen && 'justify-center w-full'}`}>
              <GiPowerRing className="text-3xl text-morphin-time animate-spin-slow" />
              {sidebarOpen && (
                <div>
                  <h1 className="text-xl font-bold text-white">Command Center</h1>
                  <p className="text-xs text-gray-400">Issue Tracker</p>
                </div>
              )}
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              {sidebarOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
            </button>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.filter(canAccess).map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
                           (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-morphin-time/20 text-white border-l-4 border-morphin-time'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
                title={!sidebarOpen ? item.label : ''}
              >
                <Icon className="text-xl flex-shrink-0" />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <div className={`flex items-center space-x-3 mb-4 ${!sidebarOpen && 'justify-center'}`}>
            <div className={`p-2 rounded-lg ${getRoleColor()} border-2 bg-gray-800/50`}>
              <FiUser className="text-xl" />
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-400 truncate">{getRoleName()}</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-red-400 transition-all ${
              !sidebarOpen && 'justify-center'
            }`}
            title={!sidebarOpen ? 'Logout' : ''}
          >
            <FiLogOut className="text-xl flex-shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        {/* Top Bar */}
        <header className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-40">
          <div className="px-6 py-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white capitalize">
              {location.pathname.split('/').pop().replace('-', ' ') || 'Dashboard'}
            </h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <FiBell className="text-xl" />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-ranger-red rounded-full"></span>
                </button>
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-4">
                    <h3 className="text-lg font-semibold mb-3">Notifications</h3>
                    <div className="space-y-2 text-sm text-gray-400">
                      <p>No new notifications</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
