import React, { useState } from 'react';
import { useIssues } from '../context/IssueContext';
import { FiCheckCircle, FiClock, FiPause, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

const StatusUpdater = ({ issue }) => {
  const { updateIssue } = useIssues();
  const [isOpen, setIsOpen] = useState(false);

  const statuses = [
    { value: 'open', label: 'Open', icon: FiClock, color: 'text-ranger-blue' },
    { value: 'in-progress', label: 'In Progress', icon: FiClock, color: 'text-ranger-yellow' },
    { value: 'on-hold', label: 'On Hold', icon: FiPause, color: 'text-orange-400' },
    { value: 'resolved', label: 'Resolved', icon: FiCheckCircle, color: 'text-ranger-green' },
    { value: 'closed', label: 'Closed', icon: FiX, color: 'text-gray-400' },
  ];

  const handleStatusChange = (newStatus) => {
    const updates = { status: newStatus };
    
    if (newStatus === 'resolved' || newStatus === 'closed') {
      updates.resolvedAt = new Date();
    }

    updateIssue(issue.id, updates);
    setIsOpen(false);
    toast.success(`Status updated to ${statuses.find(s => s.value === newStatus)?.label}`);
  };

  const currentStatus = statuses.find((s) => s.value === issue.status);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="ranger-button bg-ranger-blue hover:bg-blue-600 text-white flex items-center space-x-2"
      >
        {currentStatus?.icon && <currentStatus.icon />}
        <span>Update Status</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-20">
            <div className="p-4 border-b border-gray-700">
              <h3 className="font-semibold text-white">Change Status</h3>
            </div>
            <div className="py-2">
              {statuses.map((status) => {
                const Icon = status.icon;
                const isActive = issue.status === status.value;
                
                return (
                  <button
                    key={status.value}
                    onClick={() => handleStatusChange(status.value)}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-700 transition-colors flex items-center space-x-3 ${
                      isActive ? 'bg-gray-700/50' : ''
                    }`}
                  >
                    <Icon className={`text-xl ${status.color}`} />
                    <span className="text-white font-medium">{status.label}</span>
                    {isActive && (
                      <span className="ml-auto text-xs text-gray-400">Current</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StatusUpdater;
