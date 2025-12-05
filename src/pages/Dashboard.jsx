import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useIssues } from '../context/IssueContext';
import {
  FiAlertCircle,
  FiClock,
  FiCheckCircle,
  FiTrendingUp,
  FiArrowRight,
} from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import RangerDashboard from '../components/dashboards/RangerDashboard';
import EngineerDashboard from '../components/dashboards/EngineerDashboard';
import AdminDashboard from '../components/dashboards/AdminDashboard';
import SuperAdminDashboard from '../components/dashboards/SuperAdminDashboard';

const Dashboard = () => {
  const { user, isRanger, isEngineer, isAdmin, isSuperAdmin } = useAuth();
  const { issues } = useIssues();

  // Calculate stats
  const stats = {
    total: issues.length,
    open: issues.filter((i) => i.status === 'open').length,
    inProgress: issues.filter((i) => i.status === 'in-progress').length,
    resolved: issues.filter((i) => i.status === 'resolved' || i.status === 'closed').length,
    critical: issues.filter((i) => i.priority === 'critical').length,
    overdue: issues.filter((i) => {
      if (i.status === 'resolved' || i.status === 'closed') return false;
      return new Date(i.slaDeadline) < new Date();
    }).length,
  };

  if (isSuperAdmin) {
    return <SuperAdminDashboard />;
  }

  if (isAdmin) {
    return <AdminDashboard />;
  }

  if (isEngineer) {
    return <EngineerDashboard />;
  }

  if (isRanger) {
    return <RangerDashboard />;
  }

  // Default dashboard
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Welcome, {user?.name}!</h1>
          <p className="text-gray-400 mt-1">Command Center Dashboard</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Issues"
          value={stats.total}
          icon={FiAlertCircle}
          color="text-ranger-blue"
          bgColor="bg-ranger-blue/20"
        />
        <StatCard
          title="Open Issues"
          value={stats.open}
          icon={FiClock}
          color="text-ranger-yellow"
          bgColor="bg-ranger-yellow/20"
        />
        <StatCard
          title="In Progress"
          value={stats.inProgress}
          icon={FiTrendingUp}
          color="text-orange-400"
          bgColor="bg-orange-400/20"
        />
        <StatCard
          title="Resolved"
          value={stats.resolved}
          icon={FiCheckCircle}
          color="text-ranger-green"
          bgColor="bg-ranger-green/20"
        />
      </div>

      {/* Quick Actions */}
      <div className="ranger-card p-6">
        <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/issues/create"
            className="p-4 bg-morphin-time/20 hover:bg-morphin-time/30 border border-morphin-time rounded-lg transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white">Create Issue</span>
              <FiArrowRight className="text-morphin-time group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
          <Link
            to="/issues"
            className="p-4 bg-ranger-blue/20 hover:bg-ranger-blue/30 border border-ranger-blue rounded-lg transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white">View All Issues</span>
              <FiArrowRight className="text-ranger-blue group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
          <Link
            to="/analytics"
            className="p-4 bg-ranger-green/20 hover:bg-ranger-green/30 border border-ranger-green rounded-lg transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white">Analytics</span>
              <FiArrowRight className="text-ranger-green group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Issues */}
      <div className="ranger-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Recent Issues</h2>
          <Link
            to="/issues"
            className="text-sm text-ranger-blue hover:text-ranger-blue/80 flex items-center space-x-1"
          >
            <span>View All</span>
            <FiArrowRight />
          </Link>
        </div>
        <div className="space-y-3">
          {issues.slice(0, 5).map((issue) => (
            <Link
              key={issue.id}
              to={`/issues/${issue.id}`}
              className="block p-4 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors border border-gray-700"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-white">{issue.title}</h3>
                    <span
                      className={`px-2 py-1 text-xs rounded border status-${issue.status.replace(
                        '-',
                        ''
                      )}`}
                    >
                      {issue.status.replace('-', ' ')}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs rounded border priority-${issue.priority}`}
                    >
                      {issue.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">{issue.description.substring(0, 100)}...</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Created {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color, bgColor }) => {
  return (
    <div className="ranger-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 ${bgColor} rounded-lg`}>
          <Icon className={`text-2xl ${color}`} />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
      <p className="text-sm text-gray-400">{title}</p>
    </div>
  );
};

export default Dashboard;
