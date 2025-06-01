import React, { useState, useEffect } from 'react';
import { UserStory, Status, Priority } from '../../types';
import Spinner from '../ui/Spinner';
import ReactDatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { parse } from 'date-fns';

interface StoryFormProps {
  initialData?: Partial<UserStory>;
  statuses: Status[];
  priorities: Priority[];
  projectId: number;
  projectMembers: any[];
  onSubmit: (data: Partial<UserStory>) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const StoryForm: React.FC<StoryFormProps> = ({
  initialData = {},
  statuses,
  priorities,
  projectId,
  projectMembers,
  onSubmit,
  onCancel,
  isSubmitting
}) => {
  const [formData, setFormData] = useState<Partial<UserStory>>({
    title: '',
    description: '',
    statusId: 0,
    priority: 439,
    assignedTo: null,
    timestamps: 0,
    startDate: null,
    finishDate: null,
    ...initialData,
    projectId
  });

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [finishDate, setFinishDate] = useState<Date | null>(null);

  useEffect(() => {
    // Set default values if not editing
    if (!initialData.id && statuses.length > 0 && formData.statusId === 0) {
      setFormData(prev => ({ ...prev, statusId: statuses[0].id }));
    }
    
    if (!initialData.id && priorities.length > 0 && formData.priority === 0) {
      const middlePriority = priorities[Math.floor(priorities.length / 2)];
      setFormData(prev => ({ ...prev, priority: middlePriority.id }));
    }

    console.log('Form data initialized:', formData);

    
    // Initialize dates and points from initial data if editing
    if (initialData.id) {
      console.log('Editing existing story:', initialData);
      // Parse start date
      if (initialData.startDate) {
        const parsedStartDate = parse(initialData.startDate, "dd-MM-yyyy HH:mm:ss", new Date());
        if (!isNaN(parsedStartDate.getTime())) {
          setStartDate(parsedStartDate);
        }
      }

      // Parse finish date
      if (initialData.finishDate) {
        const parsedFinishDate = parse(initialData.finishDate, "dd-MM-yyyy HH:mm:ss", new Date());
        if (!isNaN(parsedFinishDate.getTime())) {
          setFinishDate(parsedFinishDate);
        }
      }

    }
  }, [initialData, statuses, priorities, formData.statusId, formData.priority, formData.timestamps]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    console.log(`Field changed: ${name} = ${value}`);

    setFormData({
      ...formData,
      [name]: ['statusId', 'priority', 'assignedTo', 'timestamps'].includes(name) 
        ? Number(value) || null 
        : value
    });
  };

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
    setFormData(prev => ({
      ...prev,
      startDate: date ? date.toISOString() : null
    }));
  };

  const handleFinishDateChange = (date: Date | null) => {
    setFinishDate(date);
    setFormData(prev => ({
      ...prev,
      finishDate: date ? date.toISOString() : null
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
            placeholder="Enter story title"
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
            placeholder="Enter story description"
            className="input w-full"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="statusId" className="block text-sm font-medium text-surface-300 mb-1">
              Status
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
            <label htmlFor="priority" className="block text-sm font-medium text-surface-300 mb-1">
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              required
              className="input w-full"
            >
              <option value="">Select a priority</option>
              {priorities.map(priority => (
                <option key={priority.id} value={priority.id}>
                  {priority.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="assignedTo" className="block text-sm font-medium text-surface-300 mb-1">
              Assignee
            </label>
            <select
              id="assignedTo"
              name="assignedTo"
              value={formData.assignedTo || ''}
              onChange={handleChange}
              className="input w-full"
            >
              <option value="">Unassigned</option>
              {projectMembers.map(member => (
                <option key={member.id} value={member.id}>
                  {member.fullName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="timestamps" className="block text-sm font-medium text-surface-300 mb-1">
              Timestamps (minutes)
            </label>
            <input
              id="timestamps"
              name="timestamps"
              type="number"
              
              value={formData.timestamps ?? ''}
              onChange={handleChange}
              className="input w-full"
              placeholder="Enter estimated time in minutes"
            />
            <p className="text-xs text-surface-400 mt-1">
              Enter the estimated time in minutes for this story
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label htmlFor="startDate" className="block text-sm font-medium text-surface-300 mb-1">
              Start Date and Time
            </label>
            <ReactDatePicker
              selected={startDate}
              onChange={handleStartDateChange}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={30}
              dateFormat="yyyy-MM-dd HH:mm"
              className="input w-full"
              placeholderText="Select start date and time"
              isClearable
            />
          </div>

          <div>
            <label htmlFor="finishDate" className="block text-sm font-medium text-surface-300 mb-1">
              Finish Date and Time
            </label>
            <ReactDatePicker
              selected={finishDate}
              onChange={handleFinishDateChange}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="yyyy-MM-dd HH:mm"
              className="input w-full"
              placeholderText="Select finish date and time"
              isClearable
              minDate={startDate || undefined}
            />
          </div>
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
              <Spinner size="sm" className="mr-2" />
              {initialData.id ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            initialData.id ? 'Update Story' : 'Create Story'
          )}
        </button>
      </div>
    </form>
  );
};

export default StoryForm;