import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useIssues } from '../../context/IssueContext';
import { FiAlertCircle, FiClock, FiCheckCircle, FiUsers, FiTrendingUp } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';

const AdminDashboard = () => {
  const { issues, engineers } = useIssues();
  
  const stats = {
    total: issues.length,
    open: issues.filter((i) => i.status === 'open').length,
    inProgress: issues.filter((i) => i.status === 'in-progress').length,
    resolved: issues.filter((i) => i.status === 'resolved' || i.status === 'closed').length,
    unassigned: issues.filter((i) => !i.assignedTo && i.status !== 'closed').length,
    overdue: issues.filter((i) => {
      if (i.status === 'resolved' || i.status === 'closed') return false;
      return new Date(i.slaDeadline) < new Date();
    }).length,
  };

  const unassignedIssues = issues.filter((i) => !i.assignedTo && i.status !== 'closed');
  const recentIssues = issues
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Admin Command Dashboard</h1>
        <p className="text-gray-400 mt-1">Overview of all operations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard title="Total" value={stats.total} icon={FiAlertCircle} color="text-ranger-blue" />
        <StatCard title="Open" value={stats.open} icon={FiClock} color="text-ranger-yellow" />
        <StatCard title="In Progress" value={stats.inProgress} icon={FiTrendingUp} color="text-orange-400" />
        <StatCard title="Resolved" value={stats.resolved} icon={FiCheckCircle} color="text-ranger-green" />
        <StatCard title="Unassigned" value={stats.unassigned} icon={FiUsers} color="text-purple-400" />
        <StatCard title="Overdue" value={stats.overdue} icon={FiAlertCircle} color="text-ranger-red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Unassigned Issues */}
        <div className="ranger-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Unassigned Issues</h2>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
              {unassignedIssues.length}
            </span>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {unassignedIssues.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <FiCheckCircle className="text-4xl mx-auto mb-2 opacity-50" />
                <p>All issues assigned</p>
              </div>
            ) : (
              unassignedIssues.map((issue) => (
                <Link
                  key={issue.id}
                  to={`/issues/${issue.id}`}
                  className="block p-4 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors border border-gray-700"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-1">{issue.title}</h3>
                      <p className="text-sm text-gray-400 mb-2">{issue.description.substring(0, 80)}...</p>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded border priority-${issue.priority}`}>
                          {issue.priority}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Engineer Workload */}
        <div className="ranger-card p-6">
          <h2 className="text-xl font-bold text-white mb-4">Engineer Workload</h2>
          <div className="space-y-4">
            {engineers.map((engineer) => {
              const assigned = issues.filter((i) => i.assignedTo === engineer.name && i.status !== 'closed');
              return (
                <div
                  key={engineer.id}
                  className="p-4 bg-gray-800/50 rounded-lg border border-gray-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-white">{engineer.name}</span>
                    <span className="px-3 py-1 bg-ranger-blue/20 text-ranger-blue rounded-full text-sm">
                      {assigned.length} active
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-ranger-blue h-2 rounded-full transition-all"
                      style={{ width: `${Math.min((assigned.length / 10) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Issues */}
      <div className="ranger-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Recent Issues</h2>
          <Link
            to="/issues"
            className="text-sm text-ranger-green hover:text-ranger-green/80 flex items-center space-x-1"
          >
            <span>View All</span>
          </Link>
        </div>
        <div className="space-y-3">
          {recentIssues.map((issue) => (
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
                    <span className={`px-2 py-1 text-xs rounded border priority-${issue.priority}`}>
                      {issue.priority}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>By: {issue.createdBy}</span>
                    {issue.assignedTo && <span>Assigned: {issue.assignedTo}</span>}
                    <span>{formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color }) => {
  return (
    <div className="ranger-card p-4">
      <div className="flex items-center justify-between mb-2">
        <Icon className={`text-xl ${color}`} />
      </div>
      <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
      <p className="text-xs text-gray-400">{title}</p>
    </div>
  );
};

export default AdminDashboard;
