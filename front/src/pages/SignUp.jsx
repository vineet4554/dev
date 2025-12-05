import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GiPowerRing } from 'react-icons/gi';
import { FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'ranger',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const result = await register(
        formData.name,
        formData.email,
        formData.password,
        formData.role
      );
      
      if (result.success) {
        toast.success(`Welcome to the Command Center, ${formData.name}!`);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-ranger-black via-gray-900 to-morphin-time opacity-50"></div>
      
      <div className="relative w-full max-w-2xl">
        <div className="ranger-card p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <GiPowerRing className="text-6xl text-morphin-time mx-auto mb-4 animate-spin-slow" />
            <h1 className="text-3xl font-bold text-white mb-2">Join Command Center</h1>
            <p className="text-gray-400">Create your Power Rangers Issue Tracker account</p>
          </div>

          {/* Back to Login */}
          <Link
            to="/login"
            className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <FiArrowLeft />
            <span>Back to Login</span>
          </Link>

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name <span className="text-ranger-red">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="ranger-input"
                placeholder="e.g., Jason Red Ranger"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email <span className="text-ranger-red">*</span>
              </label>
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
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Role <span className="text-ranger-red">*</span>
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="ranger-input"
                required
              >
                <option value="ranger">Ranger</option>
                <option value="engineer">Engineer</option>
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin (Zordon)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Select your role in the command center
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password <span className="text-ranger-red">*</span>
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="ranger-input"
                placeholder="Enter your password (min. 6 characters)"
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password <span className="text-ranger-red">*</span>
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="ranger-input"
                placeholder="Confirm your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full ranger-button bg-morphin-time hover:bg-purple-600 text-white morphin-glow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Join Command Center'}
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="text-ranger-blue hover:text-ranger-blue/80 font-semibold">
                  Login here
                </Link>
              </p>
            </div>
          </form>

          {/* Role Information */}
          <div className="mt-8 pt-8 border-t border-gray-700">
            <h3 className="text-sm font-semibold text-gray-300 mb-4">Role Information</h3>
            <div className="space-y-3 text-xs text-gray-400">
              <div>
                <span className="font-semibold text-ranger-red">Ranger:</span> Report and track issues
              </div>
              <div>
                <span className="font-semibold text-ranger-blue">Engineer:</span> Fix issues assigned to you
              </div>
              <div>
                <span className="font-semibold text-ranger-green">Admin:</span> Manage issues and assign engineers
              </div>
              <div>
                <span className="font-semibold text-zordon-gold">Super Admin:</span> Full system access
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

