import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Plus } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { AddTaskModal } from '../components/tasks/AddTaskModal';
import { useTaskStore } from '../store/useTaskStore';

export const Dashboard: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const tasks = useTaskStore((state) => state.tasks);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const today = format(currentTime, 'yyyy-MM-dd');
  const todaysTasks = tasks.filter((t) => t.date === today);
  const completedTasks = todaysTasks.filter((t) => t.status === 'Completed').length;
  const totalTasks = todaysTasks.length;
  const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="page-wrapper">
      <header className="page-header">
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Good morning, User.</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            It's {format(currentTime, 'EEEE, MMMM do yyyy | HH:mm a')}
          </p>
        </div>
        <div className="page-header-actions">
          <Button icon={<Plus size={18} />} onClick={() => setIsModalOpen(true)}>Quick Add</Button>
        </div>
      </header>

      <div className="responsive-grid grid-cols-auto-fit">
        <Card>
          <h3 style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase' }}>Today's Progress</h3>
          <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: '700', lineHeight: 1 }}>{progress}%</span>
          </div>
          <div style={{ marginTop: '1rem', height: '8px', backgroundColor: 'var(--color-bg-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${progress}%`, height: '100%', backgroundColor: 'var(--color-accent-green)', transition: 'width 0.3s ease' }} />
          </div>
        </Card>

        <Card>
          <h3 style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase' }}>Completed</h3>
          <div style={{ marginTop: '1rem' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: '700', lineHeight: 1 }}>{completedTasks}</span>
            <span style={{ color: 'var(--color-text-tertiary)', marginLeft: '0.5rem' }}>tasks</span>
          </div>
        </Card>

        <Card>
          <h3 style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase' }}>Remaining</h3>
          <div style={{ marginTop: '1rem' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: '700', lineHeight: 1 }}>{totalTasks - completedTasks}</span>
            <span style={{ color: 'var(--color-text-tertiary)', marginLeft: '0.5rem' }}>tasks</span>
          </div>
        </Card>
      </div>

      <div className="responsive-grid grid-cols-2fr-1fr">
        <Card>
          <h3 style={{ marginBottom: '1rem' }}>Upcoming Deadlines</h3>
          {tasks.filter(t => t.deadline && t.status !== 'Completed').length > 0 ? (
            <ul>
               {/* List deadlines here */}
            </ul>
          ) : (
            <p style={{ color: 'var(--color-text-secondary)' }}>No upcoming deadlines.</p>
          )}
        </Card>

        <Card>
          <h3 style={{ marginBottom: '1rem' }}>Calendar Preview</h3>
          <p style={{ color: 'var(--color-text-secondary)' }}>Mini calendar widget will go here.</p>
        </Card>
      </div>

      <AddTaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        defaultDate={currentTime}
      />
    </div>
  );
};
