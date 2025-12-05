import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GiPowerRing } from 'react-icons/gi';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '', role: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  // Demo users for each role
  const demoUsers = {
    ranger: [
      { email: 'jason@rangers.com', password: 'ranger123', name: 'Jason Red Ranger', role: 'ranger' },
      { email: 'kimberly@rangers.com', password: 'ranger123', name: 'Kimberly Pink Ranger', role: 'ranger' },
    ],
    engineer: [
      { email: 'sarah@engineers.com', password: 'engineer123', name: 'Engineer Sarah', role: 'engineer' },
      { email: 'tom@engineers.com', password: 'engineer123', name: 'Engineer Tom', role: 'engineer' },
    ],
    admin: [
      { email: 'admin@command.com', password: 'admin123', name: 'Commander Alpha', role: 'admin' },
    ],
    superadmin: [
      { email: 'zordon@command.com', password: 'zordon123', name: 'Zordon', role: 'superadmin' },
    ],
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.role) {
      toast.error('Please select a role');
      return;
    }

    const userList = demoUsers[formData.role] || [];
    const user = userList.find(
      (u) => u.email === formData.email && u.password === formData.password
    );

    if (user) {
      login(user);
      toast.success(`Welcome, ${user.name}!`);
      navigate('/dashboard');
    } else {
      toast.error('Invalid credentials');
    }
  };

  const quickLogin = (user) => {
    login(user);
    toast.success(`Welcome, ${user.name}!`);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-ranger-black via-gray-900 to-morphin-time opacity-50"></div>
      
      <div className="relative w-full max-w-6xl grid md:grid-cols-2 gap-8">
        {/* Left Side - Login Form */}
        <div className="ranger-card p-8">
          <div className="text-center mb-8">
            <GiPowerRing className="text-6xl text-morphin-time mx-auto mb-4 animate-spin-slow" />
            <h1 className="text-3xl font-bold text-white mb-2">Command Center</h1>
            <p className="text-gray-400">Power Rangers Issue Tracker</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="ranger-input"
                required
              >
                <option value="">Select Role</option>
                <option value="ranger">Ranger</option>
                <option value="engineer">Engineer</option>
                <option value="admin">Admin</option>
                <option value="superadmin">Super Admin (Zordon)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="ranger-input"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="ranger-input"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full ranger-button bg-morphin-time hover:bg-purple-600 text-white morphin-glow"
            >
              Login to Command Center
            </button>
          </form>
        </div>

        {/* Right Side - Quick Login */}
        <div className="ranger-card p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Quick Login (Demo)</h2>
          
          <div className="space-y-4">
            {/* Rangers */}
            <div>
              <h3 className="text-sm font-semibold text-ranger-red mb-2 uppercase">Rangers</h3>
              <div className="space-y-2">
                {demoUsers.ranger.map((user) => (
                  <button
                    key={user.email}
                    onClick={() => quickLogin(user)}
                    className="w-full ranger-button bg-ranger-red/20 hover:bg-ranger-red/30 border border-ranger-red text-ranger-red text-left px-4 py-2 rounded"
                  >
                    <div className="font-semibold">{user.name}</div>
                    <div className="text-xs opacity-75">{user.email}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Engineers */}
            <div>
              <h3 className="text-sm font-semibold text-ranger-blue mb-2 uppercase">Engineers</h3>
              <div className="space-y-2">
                {demoUsers.engineer.map((user) => (
                  <button
                    key={user.email}
                    onClick={() => quickLogin(user)}
                    className="w-full ranger-button bg-ranger-blue/20 hover:bg-ranger-blue/30 border border-ranger-blue text-ranger-blue text-left px-4 py-2 rounded"
                  >
                    <div className="font-semibold">{user.name}</div>
                    <div className="text-xs opacity-75">{user.email}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Admin */}
            <div>
              <h3 className="text-sm font-semibold text-ranger-green mb-2 uppercase">Admin</h3>
              <div className="space-y-2">
                {demoUsers.admin.map((user) => (
                  <button
                    key={user.email}
                    onClick={() => quickLogin(user)}
                    className="w-full ranger-button bg-ranger-green/20 hover:bg-ranger-green/30 border border-ranger-green text-ranger-green text-left px-4 py-2 rounded"
                  >
                    <div className="font-semibold">{user.name}</div>
                    <div className="text-xs opacity-75">{user.email}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Super Admin */}
            <div>
              <h3 className="text-sm font-semibold text-zordon-gold mb-2 uppercase">Super Admin</h3>
              <div className="space-y-2">
                {demoUsers.superadmin.map((user) => (
                  <button
                    key={user.email}
                    onClick={() => quickLogin(user)}
                    className="w-full ranger-button bg-zordon-gold/20 hover:bg-zordon-gold/30 border border-zordon-gold text-zordon-gold text-left px-4 py-2 rounded"
                  >
                    <div className="font-semibold">{user.name}</div>
                    <div className="text-xs opacity-75">{user.email}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
