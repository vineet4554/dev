import React, { useState } from 'react';
import { useIssues } from '../context/IssueContext';
import { FiUser, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

const EngineerAssignment = ({ issue }) => {
  const { engineers, assignEngineer } = useIssues();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEngineer, setSelectedEngineer] = useState(issue.assignedTo || null);

  const handleAssign = (engineerName) => {
    if (engineerName === issue.assignedTo) {
      toast.error('Engineer already assigned');
      return;
    }

    assignEngineer(issue.id, engineerName);
    setSelectedEngineer(engineerName);
    setIsOpen(false);
    toast.success(`Issue assigned to ${engineerName}`);
  };

  const handleUnassign = () => {
    assignEngineer(issue.id, null);
    setSelectedEngineer(null);
    setIsOpen(false);
    toast.success('Engineer unassigned');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="ranger-button bg-ranger-green hover:bg-green-600 text-white flex items-center space-x-2"
      >
        <FiUser />
        <span>{issue.assignedTo ? 'Reassign' : 'Assign Engineer'}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-20">
            <div className="p-4 border-b border-gray-700">
              <h3 className="font-semibold text-white">Assign Engineer</h3>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {engineers.map((engineer) => {
                const isAssigned = selectedEngineer === engineer.name;
                return (
                  <button
                    key={engineer.id}
                    onClick={() => handleAssign(engineer.name)}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-700 transition-colors flex items-center justify-between ${
                      isAssigned ? 'bg-ranger-green/20' : ''
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-white">{engineer.name}</p>
                      <p className="text-xs text-gray-400">
                        {engineer.workload} active issue{engineer.workload !== 1 ? 's' : ''}
                      </p>
                    </div>
                    {isAssigned && (
                      <FiCheck className="text-ranger-green text-xl" />
                    )}
                  </button>
                );
              })}
            </div>
            {selectedEngineer && (
              <div className="p-4 border-t border-gray-700">
                <button
                  onClick={handleUnassign}
                  className="w-full px-4 py-2 text-sm text-ranger-red hover:bg-ranger-red/20 rounded transition-colors"
                >
                  Unassign
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default EngineerAssignment;
