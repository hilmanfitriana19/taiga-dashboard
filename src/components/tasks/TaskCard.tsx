import React from 'react';
import { Task } from '../../types';
import { motion } from 'framer-motion';
import { Calendar, LinkIcon, User } from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  onTimeClick?: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick, onTimeClick }) => {
  // Function to determine badge color based on status
  const getStatusColor = (status: string) => {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes('new') || lowerStatus.includes('ready')) {
      return 'bg-blue-500/20 text-blue-300 border-blue-500/20';
    } else if (lowerStatus.includes('progress') || lowerStatus.includes('in progress')) {
      return 'bg-amber-500/20 text-amber-300 border-amber-500/20';
    } else if (lowerStatus.includes('done') || lowerStatus.includes('closed')) {
      return 'bg-green-500/20 text-green-300 border-green-500/20';
    } else if (lowerStatus.includes('blocked') || lowerStatus.includes('hold')) {
      return 'bg-red-500/20 text-red-300 border-red-500/20';
    } else {
      return 'bg-surface-500/20 text-surface-300 border-surface-500/20';
    }
  };

  // Function to determine due date status
  const getDueDateStatus = (dateString: string | null) => {
    if (!dateString) return null;
    
    const dueDate = new Date(dateString);
    if (isPast(dueDate) && !isToday(dueDate)) {
      return {
        class: 'bg-red-500/20 text-red-300 border-red-500/20',
        label: 'Overdue'
      };
    } else if (isToday(dueDate)) {
      return {
        class: 'bg-amber-500/20 text-amber-300 border-amber-500/20',
        label: 'Today'
      };
    } else {
      return {
        class: 'bg-surface-500/20 text-surface-300 border-surface-500/20',
        label: format(dueDate, 'MMM d, yyyy')
      };
    }
  };

  const statusClass = getStatusColor(task.status);
  const dueDateStatus = task.dueDate ? getDueDateStatus(task.dueDate) : null;

  const handleTimeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onTimeClick?.();
  };

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="card card-hover cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-3">
        <span className={`badge ${statusClass}`}>{task.status}</span>
        <span className="text-xs text-surface-400">#{task.ref}</span>
      </div>
      
      <h3 className="text-base font-medium text-surface-100 mb-2 line-clamp-2">
        {task.title}
      </h3>
      
      {task.description && (
        <p className="text-sm text-surface-300 mb-4 line-clamp-2">
          {task.description}
        </p>
      )}
      
      <div className="mt-auto space-y-2">
        {task.userStoryTitle && (
          <div className="flex items-center gap-1.5 text-xs text-surface-400">
            <LinkIcon size={14} />
            <span className="truncate">{task.userStoryTitle}</span>
          </div>
        )}
        
        <div className="flex flex-wrap items-center justify-between pt-2 gap-y-2">
          {dueDateStatus && (
            <button
              onClick={handleTimeClick}
              className={`flex items-center gap-1.5 text-xs badge ${dueDateStatus.class}`}
            >
              <Calendar size={14} />
              <span>{dueDateStatus.label}</span>
            </button>
          )}
          
          {task.assignedToName && (
            <div className="flex items-center gap-1.5 text-xs text-surface-400">
              <User size={14} />
              <span className="truncate max-w-[100px]">{task.assignedToName}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;