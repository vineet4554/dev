import React from 'react';
import { Link } from 'react-router-dom';
import { useIssues } from '../../context/IssueContext';
import { useAuth } from '../../context/AuthContext';
import { FiAlertCircle, FiClock, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';
import { formatDistanceToNow, formatDistanceStrict } from 'date-fns';
import SLATimer from '../SLATimer';

const EngineerDashboard = () => {
  const { issues } = useIssues();
  const { user } = useAuth();

  const assignedIssues = issues.filter((issue) => issue.assignedTo === user?.name);
  const inProgress = assignedIssues.filter((i) => i.status === 'in-progress');
  const overdue = assignedIssues.filter((i) => {
    if (i.status === 'resolved' || i.status === 'closed') return false;
    return new Date(i.slaDeadline) < new Date();
  });
  const upcomingDeadline = assignedIssues
    .filter((i) => {
      if (i.status === 'resolved' || i.status === 'closed') return false;
      const deadline = new Date(i.slaDeadline);
      const now = new Date();
      const hoursUntil = (deadline - now) / (1000 * 60 * 60);
      return hoursUntil > 0 && hoursUntil <= 2;
    })
    .sort((a, b) => new Date(a.slaDeadline) - new Date(b.slaDeadline));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Welcome, {user?.name}!</h1>
        <p className="text-gray-400 mt-1">Engineer Dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Assigned"
          value={assignedIssues.length}
          icon={FiAlertCircle}
          color="text-ranger-blue"
          bgColor="bg-ranger-blue/20"
        />
        <StatCard
          title="In Progress"
          value={inProgress.length}
          icon={FiClock}
          color="text-ranger-yellow"
          bgColor="bg-ranger-yellow/20"
        />
        <StatCard
          title="Overdue"
          value={overdue.length}
          icon={FiAlertTriangle}
          color="text-ranger-red"
          bgColor="bg-ranger-red/20"
        />
        <StatCard
          title="Resolved"
          value={assignedIssues.filter((i) => i.status === 'resolved' || i.status === 'closed').length}
          icon={FiCheckCircle}
          color="text-ranger-green"
          bgColor="bg-ranger-green/20"
        />
      </div>

      {upcomingDeadline.length > 0 && (
        <div className="ranger-card p-6 border-2 border-ranger-yellow">
          <div className="flex items-center space-x-2 mb-4">
            <FiAlertTriangle className="text-ranger-yellow text-xl" />
            <h2 className="text-xl font-bold text-white">Upcoming SLA Deadlines</h2>
          </div>
          <div className="space-y-3">
            {upcomingDeadline.slice(0, 3).map((issue) => (
              <Link
                key={issue.id}
                to={`/issues/${issue.id}`}
                className="block p-4 bg-yellow-900/20 hover:bg-yellow-900/30 rounded-lg transition-colors border border-ranger-yellow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-white">{issue.title}</h3>
                    <SLATimer deadline={issue.slaDeadline} />
                  </div>
                  <FiAlertTriangle className="text-ranger-yellow text-xl" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="ranger-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">My Assigned Issues</h2>
          <Link
            to="/issues"
            className="text-sm text-ranger-blue hover:text-ranger-blue/80 flex items-center space-x-1"
          >
            <span>View All</span>
          </Link>
        </div>
        <div className="space-y-3">
          {assignedIssues.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <FiAlertCircle className="text-4xl mx-auto mb-2 opacity-50" />
              <p>No issues assigned yet</p>
            </div>
          ) : (
            assignedIssues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))
          )}
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

const IssueCard = ({ issue }) => {
  const isOverdue = new Date(issue.slaDeadline) < new Date() && 
                    issue.status !== 'resolved' && issue.status !== 'closed';

  return (
    <Link
      to={`/issues/${issue.id}`}
      className={`block p-4 rounded-lg transition-colors border ${
        isOverdue
          ? 'bg-ranger-red/10 hover:bg-ranger-red/20 border-ranger-red'
          : 'bg-gray-800/50 hover:bg-gray-800 border-gray-700'
      }`}
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
          <p className="text-sm text-gray-400 mb-2">{issue.description.substring(0, 100)}...</p>
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span>Category: {issue.category}</span>
            <span>Reported by: {issue.createdBy}</span>
            <SLATimer deadline={issue.slaDeadline} />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EngineerDashboard;
