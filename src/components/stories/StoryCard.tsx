import React from 'react';
import { UserStory } from '../../types';
import { motion } from 'framer-motion';
import { FileText, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';

interface StoryCardProps {
  story: UserStory;
  onClick: () => void;
}

const StoryCard: React.FC<StoryCardProps> = ({ story, onClick }) => {
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

  // Function to determine priority color
  const getPriorityColor = (priority: string) => {
    const lowerPriority = priority?.toLowerCase() || '';
    if (lowerPriority.includes('high')) {
      return 'bg-red-500/20 text-red-300 border-red-500/20';
    } else if (lowerPriority.includes('normal') || lowerPriority.includes('medium')) {
      return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/20';
    } else if (lowerPriority.includes('low')) {
      return 'bg-green-500/20 text-green-300 border-green-500/20';
    } else {
      return 'bg-surface-500/20 text-surface-300 border-surface-500/20';
    }
  };

  const statusClass = getStatusColor(story.status);
  const priorityClass = getPriorityColor(story.priorityName || '');
  const formattedDate = story.modifiedDate 
    ? format(new Date(story.modifiedDate), 'MMM d, yyyy')
    : '';

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="card card-hover cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-3">
        <span className={`badge ${statusClass}`}>{story.status}</span>
        <span className="text-xs text-surface-400">#{story.ref}</span>
      </div>
      
      <h3 className="text-base font-medium text-surface-100 mb-2 line-clamp-2">
        {story.title}
      </h3>
      
      {story.description && (
        <p className="text-sm text-surface-300 mb-4 line-clamp-2">
          {story.description}
        </p>
      )}
      
      <div className="flex flex-wrap items-center justify-between mt-auto pt-2 gap-y-2">
        <div className="flex items-center gap-1 text-xs text-surface-400">
          <Calendar size={14} />
          <span>{formattedDate}</span>
        </div>
        
        {story.priorityName && (
          <span className={`badge ${priorityClass}`}>
            {story.priorityName}
          </span>
        )}
        
        {story.assignedToName && (
          <div className="flex items-center gap-1.5 text-xs text-surface-400">
            <User size={14} />
            <span className="truncate max-w-[100px]">{story.assignedToName}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StoryCard;