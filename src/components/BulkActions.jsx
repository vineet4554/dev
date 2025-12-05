import React, { useState } from 'react';
import { useIssues } from '../context/IssueContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const BulkActions = ({ selectedIssues, onClear }) => {
  const { issues, bulkUpdate } = useIssues();
  const { engineers } = useIssues();
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showAssignMenu, setShowAssignMenu] = useState(false);

  const handleBulkStatusUpdate = (newStatus) => {
    bulkUpdate(selectedIssues, { status: newStatus });
    toast.success(`Updated ${selectedIssues.length} issue(s) to ${newStatus}`);
    setShowStatusMenu(false);
    onClear();
  };

  const handleBulkAssign = (engineerName) => {
    bulkUpdate(selectedIssues, { 
      assignedTo: engineerName,
      status: 'in-progress'
    });
    toast.success(`Assigned ${selectedIssues.length} issue(s) to ${engineerName}`);
    setShowAssignMenu(false);
    onClear();
  };

  const handleBulkClose = () => {
    bulkUpdate(selectedIssues, { status: 'closed' });
    toast.success(`Closed ${selectedIssues.length} issue(s)`);
    onClear();
  };

  return (
    <div className="ranger-card p-4 bg-morphin-time/10 border-2 border-morphin-time">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="font-semibold text-white">
            {selectedIssues.length} issue(s) selected
          </span>
          <button
            onClick={onClear}
            className="text-sm text-gray-400 hover:text-white"
          >
            Clear selection
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <button
              onClick={() => {
                setShowStatusMenu(!showStatusMenu);
                setShowAssignMenu(false);
              }}
              className="ranger-button bg-ranger-blue hover:bg-blue-600 text-white"
            >
              Update Status
            </button>
            {showStatusMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-10">
                <button
                  onClick={() => handleBulkStatusUpdate('open')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-700 text-white"
                >
                  Open
                </button>
                <button
                  onClick={() => handleBulkStatusUpdate('in-progress')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-700 text-white"
                >
                  In Progress
                </button>
                <button
                  onClick={() => handleBulkStatusUpdate('on-hold')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-700 text-white"
                >
                  On Hold
                </button>
                <button
                  onClick={() => handleBulkStatusUpdate('resolved')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-700 text-white"
                >
                  Resolved
                </button>
              </div>
            )}
          </div>
          <div className="relative">
            <button
              onClick={() => {
                setShowAssignMenu(!showAssignMenu);
                setShowStatusMenu(false);
              }}
              className="ranger-button bg-ranger-green hover:bg-green-600 text-white"
            >
              Assign Engineer
            </button>
            {showAssignMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-10">
                {engineers.map((engineer) => (
                  <button
                    key={engineer.id}
                    onClick={() => handleBulkAssign(engineer.name)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-700 text-white"
                  >
                    {engineer.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={handleBulkClose}
            className="ranger-button bg-gray-600 hover:bg-gray-500 text-white"
          >
            Close Selected
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkActions;
