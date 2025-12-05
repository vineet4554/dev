import React from 'react';
import { formatDistanceStrict } from 'date-fns';
import { FiClock } from 'react-icons/fi';

const SLATimer = ({ deadline, showIcon = true }) => {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const isOverdue = deadlineDate < now;
  const hoursRemaining = (deadlineDate - now) / (1000 * 60 * 60);
  const isUrgent = hoursRemaining > 0 && hoursRemaining <= 2;

  let colorClass = 'text-gray-400';
  let bgClass = 'bg-gray-700/20';
  
  if (isOverdue) {
    colorClass = 'text-ranger-red';
    bgClass = 'bg-ranger-red/20';
  } else if (isUrgent) {
    colorClass = 'text-ranger-yellow';
    bgClass = 'bg-ranger-yellow/20';
  } else if (hoursRemaining <= 4) {
    colorClass = 'text-orange-400';
    bgClass = 'bg-orange-400/20';
  } else {
    colorClass = 'text-ranger-green';
    bgClass = 'bg-ranger-green/20';
  }

  const formatTime = () => {
    if (isOverdue) {
      return `Overdue by ${formatDistanceStrict(now, deadlineDate)}`;
    }
    return `${formatDistanceStrict(deadlineDate, now)} remaining`;
  };

  return (
    <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded text-xs ${bgClass} ${colorClass}`}>
      {showIcon && <FiClock className="text-xs" />}
      <span>{formatTime()}</span>
    </div>
  );
};

export default SLATimer;
