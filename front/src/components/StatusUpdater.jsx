import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useIssues } from '../context/IssueContext';
import { FiCheckCircle, FiClock, FiPause, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

const StatusUpdater = ({ issue }) => {
  const { updateStatus } = useIssues();
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);

  const statuses = [
    { value: 'open', label: 'Open', icon: FiClock, color: 'text-ranger-blue' },
    { value: 'in-progress', label: 'In Progress', icon: FiClock, color: 'text-ranger-yellow' },
    { value: 'on-hold', label: 'On Hold', icon: FiPause, color: 'text-orange-400' },
    { value: 'resolved', label: 'Resolved', icon: FiCheckCircle, color: 'text-ranger-green' },
    { value: 'closed', label: 'Closed', icon: FiX, color: 'text-gray-400' },
  ];

  const handleStatusChange = async (newStatus) => {
    try {
      await updateStatus(issue.id, newStatus);
      setIsOpen(false);
    } catch (error) {
      // Error already handled in updateStatus
    }
  };

  const currentStatus = statuses.find((s) => s.value === issue.status);

  const updateMenuPosition = () => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const menuWidth = 256; // w-64
    const gap = 8; // space between button and menu
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
        className="ranger-button bg-ranger-blue hover:bg-blue-600 text-white flex items-center space-x-2"
      >
        {currentStatus?.icon && <currentStatus.icon />}
        <span>Update Status</span>
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
                <h3 className="font-semibold text-white">Change Status</h3>
              </div>
              <div className="py-2 max-h-64 overflow-y-auto">
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
          </>,
          document.body
        )
      )}
    </div>
  );
};

export default StatusUpdater;