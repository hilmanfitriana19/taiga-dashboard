import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Project } from '../types';
import { useAuth } from '../context/AuthContext';
import { createTaigaApiService } from '../services/api';
import ProjectList from '../components/projects/ProjectList';
import { Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const DashboardPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchProjects = async () => {
      try {
        setLoading(true);
        const api = createTaigaApiService();
        const projectsData = await api.getProjects();
        
        // For each project, fetch additional data (stories, tasks count)
        const projectsWithCounts = await Promise.all(
          projectsData.map(async (project) => {
            try {
              const stories = await api.getProjectUserStories(project.id);
              const tasks = await api.getProjectTasks(project.id);
              
              return {
                ...project,
                totalStories: stories.length,
                totalTasks: tasks.length
              };
            } catch (error) {
              // If we can't get counts, just return the project
              return project;
            }
          })
        );
        
        setProjects(projectsWithCounts);
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast.error('Failed to load projects. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [isAuthenticated, navigate]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-surface-400">
            View and manage your Taiga projects
          </p>
        </motion.div>
      </div>

      <div className="mb-8">
        <div className="card p-6 border-l-4 border-l-primary-500">
          <div className="flex items-start gap-4">
            <div className="bg-primary-500/20 p-2 rounded-full">
              <Layers className="h-6 w-6 text-primary-500" />
            </div>
            <div>
              <h2 className="text-lg font-medium mb-1">Your Projects</h2>
              <p className="text-surface-400 text-sm">
                Explore your projects, create and manage stories and tasks, or collaborate with your team.
              </p>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <ProjectList projects={projects} loading={loading} />
      </motion.div>
    </div>
  );
};

export default DashboardPage;