import React, { useState, useEffect } from 'react';
import { UserStory } from '../../types';
import StoryCard from './StoryCard';
import SearchInput from '../ui/SearchInput';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { createTaigaApiService } from '../../services/api';

interface StoryListProps {
  stories: UserStory[];
  onStoryClick: (story: UserStory) => void;
  projectMembers: any[];
  projectId: number;
}

const StoryList: React.FC<StoryListProps> = ({ stories: initialStories, onStoryClick, projectMembers, projectId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ assignee: '', status: '' });
  const [filteredStories, setFilteredStories] = useState<UserStory[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFilteredStories = async () => {
      try {
        setLoading(true);
        const api = createTaigaApiService();
        console.log('projectId:', projectId);
        console.log('Fetching stories with filters:', filters);

        // If there's an assignee filter, fetch stories for that assignee
        if (filters.assignee) {
          const stories = await api.getProjectUserStories(projectId, filters.assignee ?? '');
          setFilteredStories(stories);
        } else {
          // If no assignee filter, use the initial stories
          setFilteredStories(initialStories);
        }
      } catch (error) {
        console.error('Error fetching filtered stories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredStories();
  }, [filters.assignee, initialStories, projectId]);

  // Filter by search term and status locally
  const displayedStories = filteredStories.filter(story => {
    const matchesSearch = 
      story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !filters.status || 
      story.status.toLowerCase().includes(filters.status.toLowerCase());

    return matchesSearch && matchesStatus;
  });

  // Group stories by status
  const groupedStories = displayedStories.reduce((acc, story) => {
    let status = story.status || 'No Status';
    // Normalize status names
    if (status.toLowerCase().includes('new') || status.toLowerCase().includes('ready')) {
      status = 'Open';
    } else if (status.toLowerCase().includes('progress')) {
      status = 'In Progress';
    } else if (status.toLowerCase().includes('done') || status.toLowerCase().includes('closed')) {
      status = 'Done';
    }
    
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(story);
    return acc;
  }, {} as { [key: string]: UserStory[] });

  // Ensure specific order of status columns
  const orderedGroups: { [key: string]: UserStory[] } = {};
  ['Open', 'In Progress', 'Done'].forEach(status => {
    if (groupedStories[status]) {
      orderedGroups[status] = groupedStories[status];
    }
  });

  return (
    <div>
      <div className="mb-6">
        <SearchInput
          placeholder="Search stories..."
          value={searchTerm}
          onChange={setSearchTerm}
          className="max-w-md"
          showFilters={true}
          assignees={projectMembers}
          onFilterChange={setFilters}
        />
      </div>

      {Object.keys(orderedGroups).length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-surface-800/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-surface-400" />
          </div>
          <h3 className="text-xl font-medium text-surface-200 mb-2">No stories found</h3>
          <p className="text-surface-400 max-w-md mx-auto">
            {searchTerm || filters.assignee || filters.status
              ? 'No stories match your search criteria. Try adjusting your filters.'
              : 'There are no stories in this project yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(orderedGroups).map(([status, stories]) => (
            <motion.div
              key={status}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold text-surface-100">{status}</h2>
                <span className="text-sm text-surface-400">({stories.length})</span>
              </div>
              <div className="space-y-4">
                <AnimatePresence>
                  {stories.map(story => (
                    <motion.div
                      key={story.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <StoryCard story={story} onClick={() => onStoryClick(story)} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StoryList;