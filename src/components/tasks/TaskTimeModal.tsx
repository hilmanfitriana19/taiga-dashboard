import React, { useState } from 'react';
import { Task } from '../../types';
import Modal from '../ui/Modal';
import ReactDatePicker from 'react-datepicker';
import { Calendar } from 'lucide-react';
import Spinner from '../ui/Spinner';
import { createTaigaApiService } from '../../services/api';
import toast from 'react-hot-toast';

interface TaskTimeModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const TaskTimeModal: React.FC<TaskTimeModalProps> = ({
  task,
  isOpen,
  onClose,
  onUpdate
}) => {
  const [dueDate, setDueDate] = useState<Date | null>(
    task.dueDate ? new Date(task.dueDate) : null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      const api = createTaigaApiService();
      
      await api.updateTask(task.id, {
        dueDate: dueDate ? dueDate.toISOString().split('T')[0] : null
      });
      
      toast.success('Task time updated successfully');
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating task time:', error);
      toast.error('Failed to update task time');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Update Task Time"
      size="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-surface-300 mb-2">
            Due Date
          </label>
          <div className="relative">
            <ReactDatePicker
              selected={dueDate}
              onChange={setDueDate}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="yyyy-MM-dd HH:mm"
              className="input w-full"
              placeholderText="Select due date and time"
              isClearable
              customInput={
                <div className="input flex items-center cursor-pointer">
                  <Calendar size={16} className="mr-2 text-surface-400" />
                  <span>
                    {dueDate ? dueDate.toLocaleString() : "Set due date and time"}
                  </span>
                </div>
              }
            />
          </div>
          <p className="mt-1 text-sm text-surface-400">
            Set the due date and time for this task
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
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
                Updating...
              </>
            ) : (
              'Update Time'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskTimeModal;