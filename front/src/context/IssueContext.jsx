import React, { createContext, useContext, useState, useEffect } from 'react';
import { issuesAPI, commentsAPI, attachmentsAPI, engineersAPI } from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const IssueContext = createContext(null);

export const useIssues = () => {
  const context = useContext(IssueContext);
  if (!context) {
    throw new Error('useIssues must be used within IssueProvider');
  }
  return context;
};

export const IssueProvider = ({ children }) => {
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [engineers, setEngineers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load issues and engineers when user changes (login / logout / signup)
  useEffect(() => {
    const init = async () => {
      if (!user) {
        setIssues([]);
        setEngineers([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        await Promise.all([loadIssues(), loadEngineers()]);
      } finally {
        setLoading(false);
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadIssues = async (filters = {}) => {
    try {
      setLoading(true);
      const response = await issuesAPI.getAll(filters);
      const issuesData = response.data.map(issue => ({
        ...issue,
        id: issue._id,
        createdAt: new Date(issue.createdAt),
        slaDeadline: issue.slaDeadline ? new Date(issue.slaDeadline) : null,
        resolvedAt: issue.resolvedAt ? new Date(issue.resolvedAt) : null,
        closedAt: issue.closedAt ? new Date(issue.closedAt) : null,
        createdBy: issue.createdBy?.name ? issue.createdBy : (issue.createdBy || {}),
        assignedTo: issue.assignedTo?.name ? issue.assignedTo : (issue.assignedTo || null),
      }));
      setIssues(issuesData);
    } catch (error) {
      console.error('Failed to load issues:', error);
      toast.error('Failed to load issues');
    } finally {
      setLoading(false);
    }
  };

  const loadEngineers = async () => {
    try {
      const response = await engineersAPI.getAll();
      const engineersData = response.data.map(eng => ({
        id: eng._id,
        name: eng.name,
        workload: eng.workload || 0,
      }));
      setEngineers(engineersData);
    } catch (error) {
      console.error('Failed to load engineers:', error);
    }
  };

  const createIssue = async (issueData) => {
    try {
      const response = await issuesAPI.create(issueData);
      const newIssue = {
        ...response.data,
        id: response.data._id,
        createdAt: new Date(response.data.createdAt),
        slaDeadline: response.data.slaDeadline ? new Date(response.data.slaDeadline) : null,
        createdBy: response.data.createdBy?.name ? response.data.createdBy : (response.data.createdBy || {}),
        assignedTo: response.data.assignedTo?.name ? response.data.assignedTo : (response.data.assignedTo || null),
      };
      setIssues(prev => [...prev, newIssue]);
      toast.success('Issue created successfully!');
      return newIssue;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create issue';
      toast.error(message);
      throw error;
    }
  };

  const updateIssue = async (issueId, updates) => {
    try {
      const response = await issuesAPI.update(issueId, updates);
      const updatedIssue = {
        ...response.data,
        id: response.data._id,
        createdAt: new Date(response.data.createdAt),
        slaDeadline: response.data.slaDeadline ? new Date(response.data.slaDeadline) : null,
        resolvedAt: response.data.resolvedAt ? new Date(response.data.resolvedAt) : null,
        closedAt: response.data.closedAt ? new Date(response.data.closedAt) : null,
        createdBy: response.data.createdBy?.name ? response.data.createdBy : (response.data.createdBy || {}),
        assignedTo: response.data.assignedTo?.name ? response.data.assignedTo : (response.data.assignedTo || null),
      };
      setIssues(prev => prev.map(issue => (issue.id === issueId ? updatedIssue : issue)));
      return updatedIssue;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update issue';
      toast.error(message);
      throw error;
    }
  };

  const assignEngineer = async (issueId, engineerName) => {
    try {
      await issuesAPI.assign(issueId, engineerName);
      await loadIssues();
      toast.success('Engineer assigned successfully');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to assign engineer';
      toast.error(message);
      throw error;
    }
  };

  const unassignEngineer = async (issueId) => {
    try {
      await issuesAPI.unassign(issueId);
      await loadIssues();
      toast.success('Engineer unassigned');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to unassign engineer';
      toast.error(message);
      throw error;
    }
  };

  const updateStatus = async (issueId, status) => {
    try {
      await issuesAPI.updateStatus(issueId, status);
      await loadIssues();
      toast.success(`Status updated to ${status}`);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update status';
      toast.error(message);
      throw error;
    }
  };

  const addComment = async (issueId, body) => {
    try {
      await commentsAPI.create(issueId, body);
      await loadIssues();
      toast.success('Comment added');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add comment';
      toast.error(message);
      throw error;
    }
  };

  const bulkUpdate = async (issueIds, updates) => {
    try {
      await issuesAPI.bulkUpdate(issueIds, updates);
      await loadIssues();
      toast.success('Issues updated successfully');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update issues';
      toast.error(message);
      throw error;
    }
  };

  const deleteIssue = async (issueId) => {
    try {
      await issuesAPI.delete(issueId);
      setIssues(prev => prev.filter(issue => issue.id !== issueId));
      toast.success('Issue deleted successfully');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete issue';
      toast.error(message);
      throw error;
    }
  };

  const value = {
    issues,
    engineers,
    loading,
    createIssue,
    updateIssue,
    assignEngineer,
    unassignEngineer,
    updateStatus,
    addComment,
    bulkUpdate,
    deleteIssue,
    loadIssues,
    setEngineers,
  };

  return <IssueContext.Provider value={value}>{children}</IssueContext.Provider>;
};