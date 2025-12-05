import React, { createContext, useContext, useState, useEffect } from 'react';

const IssueContext = createContext(null);

export const useIssues = () => {
  const context = useContext(IssueContext);
  if (!context) {
    throw new Error('useIssues must be used within IssueProvider');
  }
  return context;
};

// Mock data for demonstration
const mockIssues = [
  {
    id: '1',
    title: 'Teleport Pad Alpha Malfunction',
    description: 'Teleport pad Alpha is not responding to activation commands. Multiple attempts failed.',
    category: 'Teleport Pad',
    priority: 'critical',
    status: 'open',
    assignedTo: null,
    createdBy: 'Jason Red Ranger',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    slaDeadline: new Date(Date.now() + 4 * 60 * 60 * 1000),
    facility: 'Command Center Alpha',
    attachments: [],
    comments: []
  },
  {
    id: '2',
    title: 'Sensor Grid Glitch - Sector 3',
    description: 'Sensor readings showing false positives in Sector 3. Need immediate calibration.',
    category: 'Sensor',
    priority: 'high',
    status: 'in-progress',
    assignedTo: 'Engineer Sarah',
    createdBy: 'Kimberly Pink Ranger',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    slaDeadline: new Date(Date.now() + 1 * 60 * 60 * 1000),
    facility: 'Command Center Alpha',
    attachments: [],
    comments: [
      {
        id: 'c1',
        author: 'Engineer Sarah',
        text: 'Investigating the sensor calibration now.',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000)
      }
    ]
  },
  {
    id: '3',
    title: 'Zord Engine Coolant Leak',
    description: 'Tyrannosaurus Dinozord showing coolant leak from main engine chamber.',
    category: 'Zord Engine',
    priority: 'critical',
    status: 'resolved',
    assignedTo: 'Engineer Tom',
    createdBy: 'Jason Red Ranger',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    slaDeadline: new Date(Date.now() - 12 * 60 * 60 * 1000),
    resolvedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    facility: 'Command Center Alpha',
    attachments: [],
    comments: []
  }
];

export const IssueProvider = ({ children }) => {
  const [issues, setIssues] = useState([]);
  const [engineers, setEngineers] = useState([
    { id: 'e1', name: 'Engineer Sarah', workload: 3 },
    { id: 'e2', name: 'Engineer Tom', workload: 2 },
    { id: 'e3', name: 'Engineer Mike', workload: 1 }
  ]);

  useEffect(() => {
    // Load issues from localStorage or use mock data
    const storedIssues = localStorage.getItem('powerRangerIssues');
    if (storedIssues) {
      setIssues(JSON.parse(storedIssues).map(issue => ({
        ...issue,
        createdAt: new Date(issue.createdAt),
        slaDeadline: new Date(issue.slaDeadline),
        resolvedAt: issue.resolvedAt ? new Date(issue.resolvedAt) : null
      })));
    } else {
      setIssues(mockIssues);
      localStorage.setItem('powerRangerIssues', JSON.stringify(mockIssues));
    }
  }, []);

  const updateIssues = (newIssues) => {
    setIssues(newIssues);
    localStorage.setItem('powerRangerIssues', JSON.stringify(newIssues));
  };

  const createIssue = (issueData) => {
    const newIssue = {
      id: Date.now().toString(),
      ...issueData,
      createdAt: new Date(),
      slaDeadline: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours default SLA
      status: 'open',
      comments: [],
      attachments: []
    };
    const updatedIssues = [...issues, newIssue];
    updateIssues(updatedIssues);
    return newIssue;
  };

  const updateIssue = (issueId, updates) => {
    const updatedIssues = issues.map(issue => 
      issue.id === issueId 
        ? { ...issue, ...updates }
        : issue
    );
    updateIssues(updatedIssues);
  };

  const assignEngineer = (issueId, engineerName) => {
    updateIssue(issueId, { 
      assignedTo: engineerName,
      status: 'in-progress'
    });
  };

  const addComment = (issueId, comment) => {
    const issue = issues.find(i => i.id === issueId);
    if (issue) {
      const newComment = {
        id: Date.now().toString(),
        ...comment,
        timestamp: new Date()
      };
      updateIssue(issueId, {
        comments: [...(issue.comments || []), newComment]
      });
    }
  };

  const bulkUpdate = (issueIds, updates) => {
    const updatedIssues = issues.map(issue =>
      issueIds.includes(issue.id)
        ? { ...issue, ...updates }
        : issue
    );
    updateIssues(updatedIssues);
  };

  const value = {
    issues,
    engineers,
    createIssue,
    updateIssue,
    assignEngineer,
    addComment,
    bulkUpdate,
    setEngineers
  };

  return <IssueContext.Provider value={value}>{children}</IssueContext.Provider>;
};
