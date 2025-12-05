import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useIssues } from '../context/IssueContext';
import { useAuth } from '../context/AuthContext';
import { FiPlusCircle, FiFilter, FiSearch } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import SLATimer from '../components/SLATimer';
import BulkActions from '../components/BulkActions';

const Issues = () => {
  const { issues } = useIssues();
  const { isAdmin, isSuperAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedIssues, setSelectedIssues] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || issue.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleSelectIssue = (issueId) => {
    setSelectedIssues((prev) =>
      prev.includes(issueId)
        ? prev.filter((id) => id !== issueId)
        : [...prev, issueId]
    );
  };

  const handleSelectAll = () => {
    if (selectedIssues.length === filteredIssues.length) {
      setSelectedIssues([]);
    } else {
      setSelectedIssues(filteredIssues.map((i) => i.id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Issues</h1>
          <p className="text-gray-400 mt-1">Track and manage all issues</p>
        </div>
        <Link
          to="/issues/create"
          className="ranger-button bg-morphin-time hover:bg-purple-600 text-white flex items-center space-x-2"
        >
          <FiPlusCircle />
          <span>Create Issue</span>
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="ranger-card p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search issues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ranger-input pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="ranger-input"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="on-hold">On Hold</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="ranger-input"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          {(isAdmin || isSuperAdmin) && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowBulkActions(!showBulkActions)}
                className="ranger-button bg-gray-700 hover:bg-gray-600 text-white flex items-center space-x-2"
              >
                <FiFilter />
                <span>Bulk Actions</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {showBulkActions && selectedIssues.length > 0 && (
        <BulkActions
          selectedIssues={selectedIssues}
          onClear={() => setSelectedIssues([])}
        />
      )}

      {/* Issues List */}
      <div className="ranger-card p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-400">
            Showing {filteredIssues.length} of {issues.length} issues
          </p>
          {(isAdmin || isSuperAdmin) && filteredIssues.length > 0 && (
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedIssues.length === filteredIssues.length && filteredIssues.length > 0}
                onChange={handleSelectAll}
                className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-morphin-time focus:ring-morphin-time"
              />
              <span className="text-sm text-gray-400">Select All</span>
            </label>
          )}
        </div>
        <div className="space-y-3">
          {filteredIssues.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <FiSearch className="text-5xl mx-auto mb-4 opacity-50" />
              <p className="text-lg">No issues found</p>
              <p className="text-sm mt-2">Try adjusting your filters</p>
            </div>
          ) : (
            filteredIssues.map((issue) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                isSelected={selectedIssues.includes(issue.id)}
                onSelect={() => handleSelectIssue(issue.id)}
                showCheckbox={isAdmin || isSuperAdmin}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const IssueCard = ({ issue, isSelected, onSelect, showCheckbox }) => {
  const isOverdue =
    new Date(issue.slaDeadline) < new Date() &&
    issue.status !== 'resolved' &&
    issue.status !== 'closed';

  return (
    <Link
      to={`/issues/${issue.id}`}
      className={`block p-4 rounded-lg transition-all border ${
        isOverdue
          ? 'bg-ranger-red/10 hover:bg-ranger-red/20 border-ranger-red'
          : 'bg-gray-800/50 hover:bg-gray-800 border-gray-700'
      }`}
      onClick={(e) => {
        if (e.target.type === 'checkbox' || e.target.closest('input')) {
          e.preventDefault();
          onSelect();
        }
      }}
    >
      <div className="flex items-start space-x-4">
        {showCheckbox && (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
            onClick={(e) => e.stopPropagation()}
            className="mt-1 w-5 h-5 rounded border-gray-600 bg-gray-700 text-morphin-time focus:ring-morphin-time"
          />
        )}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center space-x-2 flex-wrap">
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
              {isOverdue && (
                <span className="px-2 py-1 text-xs rounded bg-ranger-red/20 text-ranger-red border border-ranger-red">
                  OVERDUE
                </span>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-400 mb-3">{issue.description.substring(0, 150)}...</p>
          <div className="flex items-center flex-wrap gap-4 text-xs text-gray-500">
            <span>Category: {issue.category}</span>
            <span>Reported by: {issue.createdBy?.name || issue.createdBy || 'Unknown'}</span>
            {issue.assignedTo && <span>Assigned to: {issue.assignedTo?.name || issue.assignedTo}</span>}
            {issue.status !== 'resolved' && issue.status !== 'closed' && (
              <SLATimer deadline={issue.slaDeadline} />
            )}
            <span>{formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Issues;
