import React, { useState } from 'react';
import { useTaskStore } from '../../store/useTaskStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { Task, Priority, TimeOfDay } from '../../types';
import { format } from 'date-fns';
import '../ui/ui.css';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDate?: Date;
  defaultTimeOfDay?: TimeOfDay;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, defaultDate = new Date(), defaultTimeOfDay = 'Morning' }) => {
  const addTask = useTaskStore((state) => state.addTask);
  
  const [taskType, setTaskType] = useState<'Daily' | 'Monthly'>('Daily');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(defaultTimeOfDay);
  const [tags, setTags] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      date: format(defaultDate, 'yyyy-MM-dd'),
      timeOfDay: taskType === 'Daily' ? timeOfDay : 'Morning', // monthly defaults
      priority,
      status: 'Pending',
      repeat: taskType === 'Monthly' ? 'Monthly' : 'None',
      category: taskType,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      userId: 'user123'
    };

    addTask(newTask);
    
    // Reset state
    setTitle('');
    setDescription('');
    setTags('');
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card modal-content">
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Add New Task</h2>
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <Button 
            variant={taskType === 'Daily' ? 'primary' : 'secondary'} 
            onClick={() => setTaskType('Daily')}
            style={{ flex: 1 }}
          >Daily Task</Button>
          <Button 
            variant={taskType === 'Monthly' ? 'primary' : 'secondary'} 
            onClick={() => setTaskType('Monthly')}
            style={{ flex: 1 }}
          >Monthly Task</Button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input 
            autoFocus
            label="Task Title"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          
          <div className="input-wrapper">
            <label className="input-label">Description</label>
            <textarea 
              className="input-field" 
              rows={3} 
              placeholder="Add details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div className="form-grid">
            <div className="input-wrapper">
              <label className="input-label">Priority</label>
              <select 
                className="input-field" 
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            
            {taskType === 'Daily' && (
              <div className="input-wrapper">
                <label className="input-label">Time of Day</label>
                <select 
                  className="input-field" 
                  value={timeOfDay}
                  onChange={(e) => setTimeOfDay(e.target.value as TimeOfDay)}
                >
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Evening">Evening</option>
                  <option value="Night">Night</option>
                </select>
              </div>
            )}
          </div>

          <Input 
            label="Tags (comma separated)"
            placeholder="e.g. work, urgent"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary">Add Task</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
