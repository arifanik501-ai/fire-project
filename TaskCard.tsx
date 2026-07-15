import React, { useState, useEffect } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { GripVertical, CheckCircle2, Circle, Trash2, Timer } from 'lucide-react';
import type { Task } from '../../types';
import { Badge } from '../ui/Badge';
import { useTaskStore } from '../../store/useTaskStore';
import './TaskCard.css';

interface TaskCardProps {
  task: Task;
  index: number;
}

const formatDuration = (ms: number) => {
  if (ms < 0) ms = 0;
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor(ms / (1000 * 60 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, index }) => {
  const updateTask = useTaskStore((state) => state.updateTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    let interval: number;
    
    if (task.status === 'Completed') {
      const end = task.completedAt || Date.now();
      setElapsed(end - task.createdAt);
    } else {
      // Pending state, live count
      setElapsed(Date.now() - task.createdAt);
      interval = window.setInterval(() => {
        setElapsed(Date.now() - task.createdAt);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [task.status, task.createdAt, task.completedAt]);

  const toggleStatus = () => {
    const isNowCompleted = task.status !== 'Completed';
    updateTask(task.id, { 
      status: isNowCompleted ? 'Completed' : 'Pending',
      completedAt: isNowCompleted ? Date.now() : undefined
    });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id);
    }
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`task-card ${snapshot.isDragging ? 'is-dragging' : ''} ${task.status === 'Completed' ? 'is-completed' : ''}`}
        >
          <div {...provided.dragHandleProps} className="task-drag-handle">
            <GripVertical size={16} />
          </div>
          
          <button className="task-status-btn" onClick={toggleStatus}>
            {task.status === 'Completed' ? (
              <CheckCircle2 size={20} className="text-accent-green" style={{ color: 'var(--color-accent-green)' }} />
            ) : (
              <Circle size={20} className="text-text-tertiary" style={{ color: 'var(--color-text-tertiary)' }} />
            )}
          </button>

          <div className="task-content">
            <div className="task-header">
              <h4 className="task-title">{task.title}</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Badge priority={task.priority} />
                <button 
                  onClick={handleDelete}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-tertiary)', padding: '2px' }}
                  title="Delete Task"
                >
                  <Trash2 size={16} className="hover:text-red-500" />
                </button>
              </div>
            </div>
            
            <div className="task-meta">
              <span className="meta-item">
                <Timer size={14} />
                {task.status === 'Completed' ? 'Completed in ' : 'Pending for '}
                {formatDuration(elapsed)}
              </span>
              
              {task.category && (
                <span className="meta-item category">{task.category}</span>
              )}
            </div>
            
            {task.tags && task.tags.length > 0 && (
              <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                {task.tags.map(tag => (
                  <span key={tag} style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', backgroundColor: 'var(--color-bg-tertiary)', borderRadius: '10px', color: 'var(--color-text-secondary)' }}>
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};
