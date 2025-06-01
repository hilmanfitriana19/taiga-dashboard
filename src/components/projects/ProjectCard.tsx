import React from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../../types';
import { FolderKanban, Users, FileText, ClipboardList } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  // Generate a color based on project name for projects without a logo
  const generateColorFromName = (name: string) => {
    const colors = [
      'from-primary-600 to-primary-700',
      'from-secondary-600 to-secondary-700',
      'from-accent-600 to-accent-700',
      'from-purple-600 to-purple-700',
      'from-indigo-600 to-indigo-700',
      'from-blue-600 to-blue-700',
      'from-green-600 to-green-700'
    ];
    
    // Simple hash function to get a number from the name
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const logoColor = generateColorFromName(project.name);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Link to={`/projects/${project.id}`}>
        <div className="card card-hover h-full flex flex-col">
          <div className="flex items-start gap-4">
            {project.logoUrl ? (
              <img 
                src={project.logoUrl} 
                alt={project.name} 
                className="w-12 h-12 rounded-md object-cover"
              />
            ) : (
              <div className={`w-12 h-12 rounded-md bg-gradient-to-br ${logoColor} flex items-center justify-center shadow-md`}>
                <span className="text-white text-lg font-bold">
                  {project.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-surface-100 truncate">
                {project.name}
              </h3>
              <p className="text-surface-400 text-sm">
                {project.isPrivate ? 'Private' : 'Public'} Project
              </p>
            </div>
          </div>

          <div className="mt-4 text-surface-300 text-sm line-clamp-2 flex-1">
            {project.description || 'No description available'}
          </div>

          <div className="mt-4 pt-4 border-t border-surface-800 grid grid-cols-2 gap-2">
            <div className="flex items-center gap-1.5 text-surface-400 text-sm">
              <FileText size={16} />
              <span>{project.totalStories || 0} Stories</span>
            </div>
            <div className="flex items-center gap-1.5 text-surface-400 text-sm">
              <ClipboardList size={16} />
              <span>{project.totalTasks || 0} Tasks</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProjectCard;