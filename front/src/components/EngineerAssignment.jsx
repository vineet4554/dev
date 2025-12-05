import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useIssues } from '../context/IssueContext';
import { FiUser, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

const EngineerAssignment = ({ issue }) => {
  const { engineers, assignEngineer, unassignEngineer } = useIssues();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEngineerId, setSelectedEngineerId] = useState(
    issue.assignedTo?.id || issue.assignedTo?._id || issue.assignedTo || null
  );
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);

  const handleAssign = async (engineerId) => {
    if (engineerId === selectedEngineerId) {
      toast.error('Engineer already assigned');
      return;
    }

    try {
      await assignEngineer(issue.id, engineerId);
      setSelectedEngineerId(engineerId);
      setIsOpen(false);
    } catch (error) {
      // Error already handled in assignEngineer
    }
  };

  const handleUnassign = async () => {
    try {
      await unassignEngineer(issue.id);
      setSelectedEngineerId(null);
      setIsOpen(false);
    } catch (error) {
      // Error already handled in unassignEngineer
    }
  };

  const updateMenuPosition = () => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const menuWidth = 256; // w-64
    const gap = 8;
    const viewportWidth = window.innerWidth;

    let left = rect.right - menuWidth;
    if (left < 8) left = 8;
    if (left + menuWidth > viewportWidth - 8) {
      left = viewportWidth - menuWidth - 8;
    }

    setMenuPosition({
      top: rect.bottom + gap,
      left,
    });
  };

  useEffect(() => {
    if (!isOpen) return;
    updateMenuPosition();

    const handleResize = () => updateMenuPosition();
    const handleScroll = () => updateMenuPosition();

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        ref={buttonRef}
        className="ranger-button bg-ranger-green hover:bg-green-600 text-white flex items-center space-x-2"
      >
        <FiUser />
        <span>{issue.assignedTo ? 'Reassign' : 'Assign Engineer'}</span>
      </button>

      {isOpen && (
        createPortal(
          <>
            <div
              className="fixed inset-0 z-[9000]"
              onClick={() => setIsOpen(false)}
            ></div>
            <div
              className="fixed w-64 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-[9001]"
              style={{ top: menuPosition.top, left: menuPosition.left }}
            >
              <div className="p-4 border-b border-gray-700">
                <h3 className="font-semibold text-white">Assign Engineer</h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {engineers.map((engineer) => {
                  const engineerId = engineer.id || engineer._id;
                  const isAssigned = selectedEngineerId === engineerId;
                  return (
                    <button
                      key={engineerId}
                      onClick={() => handleAssign(engineerId)}
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
              {selectedEngineerId && (
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
          </>,
          document.body
        )
      )}
    </div>
  );
};

export default EngineerAssignment;
