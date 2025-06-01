import React, { useState, useEffect } from 'react';
import { Task, Status, UserStory } from '../../types';
import Spinner from '../ui/Spinner';
import ReactDatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface TaskFormProps {
  initialData?: Partial<Task>;
  statuses: Status[];
  userStories: UserStory[];
  projectId: number;
  onSubmit: (data: Partial<Task>) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({
  initialData = {},
  statuses,
  userStories,
  projectId,
  onSubmit,
  onCancel,
  isSubmitting
}) => {
  const [formData, setFormData] = useState<Partial<Task>>({
    title: '',
    description: '',
    statusId: 0,
    userStoryId: null,
    dueDate: null,
    ...initialData,
    projectId
  });

  const [dueDate, setDueDate] = useState<Date | null>(
    formData.dueDate ? new Date(formData.dueDate) : null
  );

  useEffect(() => {
    // Set default values if not editing
    if (!initialData.id && statuses.length > 0 && formData.statusId === 0) {
      // Usually the first status is "New" or equivalent
      setFormData(prev => ({ ...prev, statusId: statuses[0].id }));
    }
  }, [initialData, statuses, formData.statusId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'userStoryId') {
      // Convert empty string to null for userStoryId
      const userStoryId = value === '' ? null : Number(value);
      setFormData(prev => ({ ...prev, [name]: userStoryId }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'statusId' ? Number(value) : value
      }));
    }
  };

  const handleDateChange = (date: Date | null) => {
    setDueDate(date);
    setFormData(prev => ({
      ...prev,
      dueDate: date ? date.toISOString().split('T')[0] : null
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-surface-300 mb-1">
            Title *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter task title"
            className="input w-full"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-surface-300 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter task description"
            className="input w-full"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="statusId" className="block text-sm font-medium text-surface-300 mb-1">
              Status *
            </label>
            <select
              id="statusId"
              name="statusId"
              value={formData.statusId}
              onChange={handleChange}
              required
              className="input w-full"
            >
              <option value="">Select a status</option>
              {statuses.map(status => (
                <option key={status.id} value={status.id}>
                  {status.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="userStoryId" className="block text-sm font-medium text-surface-300 mb-1">
              User Story
            </label>
            <select
              id="userStoryId"
              name="userStoryId"
              value={formData.userStoryId === null ? '' : formData.userStoryId}
              onChange={handleChange}
              className="input w-full"
            >
              <option value="">None (Independent Task)</option>
              {userStories.map(story => (
                <option key={story.id} value={story.id}>
                  #{story.ref} {story.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-surface-300 mb-1">
            Due Date
          </label>
          <ReactDatePicker
            selected={dueDate}
            onChange={handleDateChange}
            dateFormat="yyyy-MM-dd"
            className="input w-full"
            placeholderText="Select a due date (optional)"
            isClearable
          />
        </div>
      </div>

      <div className="flex items-center justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-ghost"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Spinner size="sm\" className="mr-2" />
              {initialData.id ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            initialData.id ? 'Update Task' : 'Create Task'
          )}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;