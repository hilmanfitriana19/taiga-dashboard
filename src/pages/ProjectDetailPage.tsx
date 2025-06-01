import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Project, UserStory, Task, Status, Priority } from '../types';
import { useAuth } from '../context/AuthContext';
import { createTaigaApiService } from '../services/api';
import Spinner from '../components/ui/Spinner';
import Alert from '../components/ui/Alert';
import Modal from '../components/ui/Modal';
import StoryList from '../components/stories/StoryList';
import StoryForm from '../components/stories/StoryForm';
import TaskForm from '../components/tasks/TaskForm';
import TaskCard from '../components/tasks/TaskCard';
import { Plus, FileText, ClipboardList, ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const projectId = Number(id);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [project, setProject] = useState<Project | null>(null);
  const [stories, setStories] = useState<UserStory[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [storyStatuses, setStoryStatuses] = useState<Status[]>([]);
  const [taskStatuses, setTaskStatuses] = useState<Status[]>([]);
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [projectMembers, setProjectMembers] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState<'stories' | 'tasks'>('stories');
  
  // Modals state
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState<UserStory | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchProjectData = async () => {
      if (!projectId) return;
      
      try {
        setLoading(true);
        setError(null);
        const api = createTaigaApiService();
        
        // Fetch all data in parallel
        const [
          projectData,
          storiesData,
          tasksData,
          storyStatusesData,
          taskStatusesData,
          prioritiesData,
          membersData
        ] = await Promise.all([
          api.getProject(projectId),
          api.getProjectUserStories(projectId),
          api.getProjectTasks(projectId),
          api.getProjectUserStoryStatuses(projectId),
          api.getProjectTaskStatuses(projectId),
          api.getProjectPriorities(projectId),
          api.getProjectMembers(projectId)
        ]);
        
        setProject(projectData);
        setStories(storiesData);
        setTasks(tasksData);
        setStoryStatuses(storyStatusesData);
        setTaskStatuses(taskStatusesData);
        setPriorities(prioritiesData);
        setProjectMembers(membersData);
      } catch (error) {
        console.error('Error fetching project data:', error);
        setError('Failed to load project data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [projectId, isAuthenticated, navigate]);

  const handleStoryClick = async (story: UserStory) => {
    try {
      const api = createTaigaApiService();
      const fullStory = await api.getUserStory(story.id);
      setSelectedStory(fullStory);
      setIsStoryModalOpen(true);
    } catch (error) {
      console.error('Error fetching story details:', error);
      toast.error('Failed to load story details. Please try again.');
    }
  };

  const handleStorySubmit = async (storyData: Partial<UserStory>) => {
    try {
      setIsSubmitting(true);
      const api = createTaigaApiService();
      
      let updatedStory;
      if (selectedStory?.id) {
        updatedStory = await api.updateUserStory(selectedStory.id, storyData);
        setStories(stories.map(story => 
          story.id === updatedStory.id ? updatedStory : story
        ));
        toast.success('Story updated successfully');
      } else {
        updatedStory = await api.createUserStory(storyData);
        setStories([...stories, updatedStory]);
        toast.success('Story created successfully');
      }
      
      setIsStoryModalOpen(false);
      setSelectedStory(null);
    } catch (error) {
      console.error('Error submitting story:', error);
      toast.error('Failed to save story. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTaskSubmit = async (taskData: Partial<Task>) => {
    try {
      setIsSubmitting(true);
      const api = createTaigaApiService();
      
      let updatedTask;
      if (selectedTask?.id) {
        updatedTask = await api.updateTask(selectedTask.id, taskData);
        setTasks(tasks.map(task => 
          task.id === updatedTask.id ? updatedTask : task
        ));
        toast.success('Task updated successfully');
      } else {
        updatedTask = await api.createTask(taskData);
        setTasks([...tasks, updatedTask]);
        toast.success('Task created successfully');
      }
      
      setIsTaskModalOpen(false);
      setSelectedTask(null);
    } catch (error) {
      console.error('Error submitting task:', error);
      toast.error('Failed to save task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert 
          variant="error" 
          title="Error" 
          message={error || 'Project not found'} 
        />
        <div className="mt-4">
          <button
            onClick={() => navigate('/')}
            className="btn btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center text-surface-400 hover:text-surface-200 mb-4"
        >
          <ChevronLeft size={16} className="mr-1" />
          Back to Dashboard
        </button>
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <p className="text-surface-400 mt-1">
              {project.description || 'No description available'}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex border-b border-surface-800 w-full md:w-auto">
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'stories'
                ? 'text-primary-400 border-b-2 border-primary-500'
                : 'text-surface-300 hover:text-surface-200'
            }`}
            onClick={() => setActiveTab('stories')}
          >
            <span className="flex items-center">
              <FileText size={16} className="mr-2" />
              Stories
            </span>
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'tasks'
                ? 'text-primary-400 border-b-2 border-primary-500'
                : 'text-surface-300 hover:text-surface-200'
            }`}
            onClick={() => setActiveTab('tasks')}
          >
            <span className="flex items-center">
              <ClipboardList size={16} className="mr-2" />
              Tasks
            </span>
          </button>
        </div>
        
        <button 
          onClick={() => {
            if (activeTab === 'stories') {
              setSelectedStory(null);
              setIsStoryModalOpen(true);
            } else {
              setSelectedTask(null);
              setIsTaskModalOpen(true);
            }
          }}
          className="btn btn-primary"
        >
          <Plus size={16} className="mr-1" />
          {activeTab === 'stories' ? 'New Story' : 'New Task'}
        </button>
      </div>

      {/* Content */}
      {activeTab === 'stories' ? (
        <StoryList
          stories={stories}
          onStoryClick={handleStoryClick}
          projectMembers={projectMembers}
          projectId={projectId}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task}
              onClick={() => {
                setSelectedTask(task);
                setIsTaskModalOpen(true);
              }}
            />
          ))}
        </div>
      )}

      {/* Story Modal */}
      <Modal
        isOpen={isStoryModalOpen}
        onClose={() => {
          if (!isSubmitting) {
            setIsStoryModalOpen(false);
            setSelectedStory(null);
          }
        }}
        title={selectedStory ? 'Edit Story' : 'Create New Story'}
        size="lg"
      >
        <StoryForm
          initialData={selectedStory || {}}
          statuses={storyStatuses}
          priorities={priorities}
          projectId={projectId}
          projectMembers={projectMembers}
          onSubmit={handleStorySubmit}
          onCancel={() => {
            setIsStoryModalOpen(false);
            setSelectedStory(null);
          }}
          isSubmitting={isSubmitting}
        />
      </Modal>

      {/* Task Modal */}
      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => {
          if (!isSubmitting) {
            setIsTaskModalOpen(false);
            setSelectedTask(null);
          }
        }}
        title={selectedTask ? 'Edit Task' : 'Create New Task'}
        size="lg"
      >
        <TaskForm
          initialData={selectedTask || {}}
          statuses={taskStatuses}
          userStories={stories}
          projectId={projectId}
          onSubmit={handleTaskSubmit}
          onCancel={() => {
            setIsTaskModalOpen(false);
            setSelectedTask(null);
          }}
          isSubmitting={isSubmitting}
        />
      </Modal>
    </div>
  );
};

export default ProjectDetailPage