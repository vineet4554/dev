import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useIssues } from '../context/IssueContext';
import { useAuth } from '../context/AuthContext';
import { issuesAPI } from '../services/api';
import { FiArrowLeft, FiEdit2, FiUser, FiClock } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import SLATimer from '../components/SLATimer';
import CommentSystem from '../components/CommentSystem';
import EngineerAssignment from '../components/EngineerAssignment';
import StatusUpdater from '../components/StatusUpdater';
import toast from 'react-hot-toast';

const IssueDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { issues, loadIssues } = useIssues();
  const { isAdmin, isSuperAdmin, isEngineer } = useAuth();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        setLoading(true);
        // First check if issue is in context
        let foundIssue = issues.find((i) => i.id === id);
        
        if (!foundIssue) {
          // Fetch from API if not in context
          const response = await issuesAPI.getById(id);
          foundIssue = {
            ...response.data,
            id: response.data._id,
            createdAt: new Date(response.data.createdAt),
            slaDeadline: response.data.slaDeadline ? new Date(response.data.slaDeadline) : null,
            resolvedAt: response.data.resolvedAt ? new Date(response.data.resolvedAt) : null,
            closedAt: response.data.closedAt ? new Date(response.data.closedAt) : null,
            createdBy: response.data.createdBy?.name ? response.data.createdBy : (response.data.createdBy || {}),
            assignedTo: response.data.assignedTo?.name ? response.data.assignedTo : (response.data.assignedTo || null),
          };
        }
        
        setIssue(foundIssue);
      } catch (error) {
        console.error('Failed to load issue:', error);
        toast.error('Failed to load issue');
      } finally {
        setLoading(false);
      }
    };
    fetchIssue();
  }, [id]);
  
  // Reload issue when issues context updates
  useEffect(() => {
    const foundIssue = issues.find((i) => i.id === id);
    if (foundIssue) {
      setIssue(foundIssue);
    }
  }, [issues, id]);

  if (!issue) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">Issue not found</p>
        <button
          onClick={() => navigate('/issues')}
          className="mt-4 text-ranger-blue hover:underline"
        >
          Back to Issues
        </button>
      </div>
    );
  }

  const canEdit = isAdmin || isSuperAdmin || isEngineer;
  const canAssign = isAdmin || isSuperAdmin;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <button
        onClick={() => navigate('/issues')}
        className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
      >
        <FiArrowLeft />
        <span>Back to Issues</span>
      </button>

      {/* Issue Header */}
      <div className="ranger-card p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
              <h1 className="text-3xl font-bold text-white">{issue.title}</h1>
              <span
                className={`px-3 py-1 text-sm rounded border status-${issue.status.replace(
                  '-',
                  ''
                )}`}
              >
                {issue.status.replace('-', ' ')}
              </span>
              <span className={`px-3 py-1 text-sm rounded border priority-${issue.priority}`}>
                {issue.priority}
              </span>
            </div>
            <div className="flex items-center flex-wrap gap-4 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <FiUser />
                <span>Reported by: {issue.createdBy?.name || issue.createdBy || 'Unknown'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiClock />
                <span>{formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}</span>
              </div>
              {issue.status !== 'resolved' && issue.status !== 'closed' && (
                <SLATimer deadline={issue.slaDeadline} />
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        {(canEdit || canAssign) && (
          <div className="flex items-center space-x-4 pt-4 border-t border-gray-700">
            {canAssign && <EngineerAssignment issue={issue} />}
            {canEdit && <StatusUpdater issue={issue} />}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="ranger-card p-6">
            <h2 className="text-xl font-bold text-white mb-4">Description</h2>
            <p className="text-gray-300 whitespace-pre-wrap">{issue.description}</p>
          </div>

          {/* Attachments */}
          {issue.attachments && issue.attachments.length > 0 && (
            <div className="ranger-card p-6">
              <h2 className="text-xl font-bold text-white mb-4">Attachments</h2>
              <div className="space-y-2">
                {issue.attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-800/50 rounded-lg border border-gray-700 flex items-center justify-between"
                  >
                    <span className="text-white">{attachment}</span>
                    <button className="text-ranger-blue hover:underline text-sm">Download</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comments */}
          <CommentSystem issue={issue} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Issue Details */}
          <div className="ranger-card p-6">
            <h2 className="text-xl font-bold text-white mb-4">Details</h2>
            <div className="space-y-4">
              <DetailItem label="Category" value={issue.category} />
              <DetailItem label="Priority" value={issue.priority} />
              <DetailItem label="Facility" value={issue.facility} />
              <DetailItem
                label="Assigned To"
                value={issue.assignedTo?.name || issue.assignedTo || 'Unassigned'}
                highlight={!issue.assignedTo}
              />
              <DetailItem
                label="Created"
                value={new Date(issue.createdAt).toLocaleString()}
              />
              <DetailItem
                label="SLA Deadline"
                value={new Date(issue.slaDeadline).toLocaleString()}
              />
              {issue.resolvedAt && (
                <DetailItem
                  label="Resolved"
                  value={new Date(issue.resolvedAt).toLocaleString()}
                />
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="ranger-card p-6">
            <h2 className="text-xl font-bold text-white mb-4">Timeline</h2>
            <div className="space-y-4">
              <TimelineItem
                title="Issue Created"
                time={issue.createdAt}
                user={issue.createdBy?.name || issue.createdBy || 'Unknown'}
              />
              {issue.assignedTo && (
                <TimelineItem
                  title="Assigned"
                  time={issue.createdAt}
                  user={issue.assignedTo?.name || issue.assignedTo || 'Unknown'}
                />
              )}
              {issue.resolvedAt && (
                <TimelineItem
                  title="Resolved"
                  time={issue.resolvedAt}
                  user={issue.assignedTo?.name || issue.assignedTo || 'System'}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value, highlight = false }) => (
  <div>
    <p className="text-xs text-gray-400 uppercase mb-1">{label}</p>
    <p className={`font-semibold ${highlight ? 'text-ranger-yellow' : 'text-white'}`}>
      {value}
    </p>
  </div>
);

const TimelineItem = ({ title, time, user }) => (
  <div className="flex items-start space-x-3">
    <div className="w-2 h-2 bg-morphin-time rounded-full mt-2"></div>
    <div>
      <p className="text-sm font-semibold text-white">{title}</p>
      {time && (
        <p className="text-xs text-gray-400">
          {formatDistanceToNow(new Date(time), { addSuffix: true })}
        </p>
      )}
      {user && <p className="text-xs text-gray-500">by {user}</p>}
    </div>
  </div>
);

export default IssueDetail;
