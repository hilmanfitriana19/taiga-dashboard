import React, { useState, useEffect } from 'react';
import { Project } from '../../types';
import ProjectCard from './ProjectCard';
import SearchInput from '../ui/SearchInput';
import { CardSkeleton } from '../ui/SkeletonLoader';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderOpen } from 'lucide-react';

interface ProjectListProps {
  projects: Project[] | null;
  loading: boolean;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (!projects) {
      setFilteredProjects([]);
      return;
    }

    if (!searchTerm) {
      setFilteredProjects(projects);
      return;
    }

    const filtered = projects.filter(project => 
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProjects(filtered);
  }, [projects, searchTerm]);

  if (loading) {
    return (
      <div>
        <div className="mb-6">
          <SearchInput
            placeholder="Search projects..."
            value={searchTerm}
            onChange={setSearchTerm}
            className="max-w-md"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(null).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="bg-surface-800/50 w-16 h-16 rounded-full flex items-center justify-center mb-4">
          <FolderOpen className="h-8 w-8 text-surface-400" />
        </div>
        <h3 className="text-xl font-medium text-surface-200 mb-2">No projects found</h3>
        <p className="text-surface-400 text-center max-w-md">
          There are no projects available for your account or you don't have permission to view them.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <SearchInput
          placeholder="Search projects..."
          value={searchTerm}
          onChange={setSearchTerm}
          className="max-w-md"
        />
      </div>
      
      {filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="bg-surface-800/50 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <FolderOpen className="h-8 w-8 text-surface-400" />
          </div>
          <h3 className="text-xl font-medium text-surface-200 mb-2">No matching projects</h3>
          <p className="text-surface-400 text-center max-w-md">
            No projects match your search criteria. Try adjusting your search terms.
          </p>
        </div>
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredProjects.map(project => (
              <motion.div 
                key={project.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default ProjectList;