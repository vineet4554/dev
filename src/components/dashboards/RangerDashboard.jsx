import React from 'react';
import { Link } from 'react-router-dom';
import { useIssues } from '../../context/IssueContext';
import { useAuth } from '../../context/AuthContext';
import { FiAlertCircle, FiPlusCircle, FiClock, FiArrowRight } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';

const RangerDashboard = () => {
  const { issues } = useIssues();
  const { user } = useAuth();
  
  const myIssues = issues.filter((issue) => issue.createdBy === user?.name);
  const openIssues = myIssues.filter((i) => i.status === 'open' || i.status === 'in-progress');
  const resolvedIssues = myIssues.filter((i) => i.status === 'resolved' || i.status === 'closed');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Welcome, {user?.name}!</h1>
          <p className="text-gray-400 mt-1">Ranger Command Dashboard</p>
        </div>
        <Link
          to="/issues/create"
          className="ranger-button bg-ranger-red hover:bg-red-600 text-white flex items-center space-x-2"
        >
          <FiPlusCircle />
          <span>Report Issue</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="My Issues"
          value={myIssues.length}
          icon={FiAlertCircle}
          color="text-ranger-red"
          bgColor="bg-ranger-red/20"
        />
        <StatCard
          title="Open"
          value={openIssues.length}
          icon={FiClock}
          color="text-ranger-yellow"
          bgColor="bg-ranger-yellow/20"
        />
        <StatCard
          title="Resolved"
          value={resolvedIssues.length}
          icon={FiAlertCircle}
          color="text-ranger-green"
          bgColor="bg-ranger-green/20"
        />
      </div>

      <div className="ranger-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">My Reported Issues</h2>
          <Link
            to="/issues"
            className="text-sm text-ranger-red hover:text-ranger-red/80 flex items-center space-x-1"
          >
            <span>View All</span>
            <FiArrowRight />
          </Link>
        </div>
        <div className="space-y-3">
          {myIssues.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <FiAlertCircle className="text-4xl mx-auto mb-2 opacity-50" />
              <p>No issues reported yet</p>
              <Link
                to="/issues/create"
                className="text-ranger-red hover:underline mt-2 inline-block"
              >
                Report your first issue
              </Link>
            </div>
          ) : (
            myIssues.slice(0, 5).map((issue) => (
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
  return (
    <Link
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
          <p className="text-sm text-gray-400">{issue.description.substring(0, 100)}...</p>
          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
            <span>Category: {issue.category}</span>
            {issue.assignedTo && <span>Assigned: {issue.assignedTo}</span>}
            <span>{formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RangerDashboard;
