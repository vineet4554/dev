import React from 'react';
import { Link } from 'react-router-dom';
import { useIssues } from '../../context/IssueContext';
import { FiAlertCircle, FiGlobe, FiTrendingUp, FiUsers, FiBarChart2 } from 'react-icons/fi';
import { GiPowerRing } from 'react-icons/gi';

const SuperAdminDashboard = () => {
  const { issues } = useIssues();

  // Multi-facility stats (for future implementation)
  const facilities = ['Command Center Alpha', 'Command Center Beta'];
  
  const stats = {
    total: issues.length,
    open: issues.filter((i) => i.status === 'open').length,
    inProgress: issues.filter((i) => i.status === 'in-progress').length,
    resolved: issues.filter((i) => i.status === 'resolved' || i.status === 'closed').length,
    critical: issues.filter((i) => i.priority === 'critical').length,
    facilities: facilities.length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <GiPowerRing className="text-5xl text-zordon-gold animate-spin-slow" />
        <div>
          <h1 className="text-3xl font-bold text-white">Zordon Command Center</h1>
          <p className="text-gray-400 mt-1">Super Admin Dashboard - All Facilities Overview</p>
        </div>
      </div>

      {/* Zordon Stats */}
      <div className="ranger-card p-6 border-2 border-zordon-gold">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard title="Total Issues" value={stats.total} icon={FiAlertCircle} color="text-zordon-gold" />
          <StatCard title="Open" value={stats.open} icon={FiAlertCircle} color="text-ranger-yellow" />
          <StatCard title="In Progress" value={stats.inProgress} icon={FiTrendingUp} color="text-orange-400" />
          <StatCard title="Resolved" value={stats.resolved} icon={FiBarChart2} color="text-ranger-green" />
          <StatCard title="Critical" value={stats.critical} icon={FiAlertCircle} color="text-ranger-red" />
          <StatCard title="Facilities" value={stats.facilities} icon={FiGlobe} color="text-ranger-blue" />
        </div>
      </div>

      {/* Facility Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {facilities.map((facility) => {
          const facilityIssues = issues.filter((i) => i.facility === facility);
          return (
            <div key={facility} className="ranger-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">{facility}</h2>
                <Link
                  to="/issues"
                  className="text-sm text-zordon-gold hover:text-zordon-gold/80"
                >
                  View All →
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-400">Total Issues</p>
                  <p className="text-2xl font-bold text-white">{facilityIssues.length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Open</p>
                  <p className="text-2xl font-bold text-ranger-yellow">
                    {facilityIssues.filter((i) => i.status === 'open').length}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                {facilityIssues.slice(0, 3).map((issue) => (
                  <Link
                    key={issue.id}
                    to={`/issues/${issue.id}`}
                    className="block p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors border border-gray-700"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-white text-sm">{issue.title}</h3>
                      <span
                        className={`px-2 py-1 text-xs rounded border priority-${issue.priority}`}
                      >
                        {issue.priority}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="ranger-card p-6">
        <h2 className="text-xl font-bold text-white mb-4">Command Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/analytics"
            className="p-4 bg-zordon-gold/20 hover:bg-zordon-gold/30 border border-zordon-gold rounded-lg transition-all"
          >
            <FiBarChart2 className="text-2xl text-zordon-gold mb-2" />
            <h3 className="font-semibold text-white">System Analytics</h3>
            <p className="text-sm text-gray-400">View detailed analytics</p>
          </Link>
          <Link
            to="/issues"
            className="p-4 bg-ranger-blue/20 hover:bg-ranger-blue/30 border border-ranger-blue rounded-lg transition-all"
          >
            <FiAlertCircle className="text-2xl text-ranger-blue mb-2" />
            <h3 className="font-semibold text-white">All Issues</h3>
            <p className="text-sm text-gray-400">Manage all issues</p>
          </Link>
          <div className="p-4 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500 rounded-lg transition-all">
            <FiUsers className="text-2xl text-purple-400 mb-2" />
            <h3 className="font-semibold text-white">User Management</h3>
            <p className="text-sm text-gray-400">Coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color }) => {
  return (
    <div className="text-center">
      <Icon className={`text-3xl ${color} mx-auto mb-2`} />
      <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
      <p className="text-xs text-gray-400">{title}</p>
    </div>
  );
};

export default SuperAdminDashboard;
