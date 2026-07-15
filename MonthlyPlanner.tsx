import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths } from 'date-fns';
import { useTaskStore } from '../store/useTaskStore';
import { Button } from '../components/ui/Button';
import { AddTaskModal } from '../components/tasks/AddTaskModal';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

export const MonthlyPlanner: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const tasks = useTaskStore((state) => state.tasks);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  
  const startDate = startOfMonth(currentMonth);
  const endDate = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: startDate, end: endDate });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(addMonths(currentMonth, -1));

  return (
    <div className="page-wrapper">
      <header className="page-header">
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Monthly Planner</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            {format(currentMonth, 'MMMM yyyy')}
          </p>
        </div>
        <div className="page-header-actions">
          <Button variant="secondary" icon={<ChevronLeft size={18} />} onClick={prevMonth} />
          <Button variant="secondary" onClick={() => setCurrentMonth(new Date())}>This Month</Button>
          <Button variant="secondary" icon={<ChevronRight size={18} />} onClick={nextMonth} />
          <Button variant="primary" icon={<Plus size={18} />} onClick={() => setIsModalOpen(true)}>Add Task</Button>
        </div>
      </header>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(7, 1fr)', 
        gap: '0.5rem', 
        backgroundColor: 'var(--color-bg-secondary)',
        padding: '1rem',
        borderRadius: 'var(--radius-md)',
        flex: 1
      }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} style={{ textAlign: 'center', fontWeight: 600, paddingBottom: '0.5rem' }}>
            {day}
          </div>
        ))}
        
        {/* Placeholder for days before start of month to align correctly (simplified for brevity) */}
        {Array.from({ length: startDate.getDay() }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        
        {daysInMonth.map(day => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const dayTasks = tasks.filter(t => t.date === dateStr);
          const isToday = isSameDay(day, new Date());
          
          return (
            <div 
              key={dateStr}
              style={{ 
                minHeight: '100px',
                backgroundColor: 'var(--color-bg-primary)',
                border: isToday ? '2px solid var(--color-accent-green)' : '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem'
              }}
            >
              <div style={{ textAlign: 'right', fontSize: '0.875rem', fontWeight: isToday ? 700 : 400, color: isToday ? 'var(--color-accent-green)' : 'inherit' }}>
                {format(day, 'd')}
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem', overflowY: 'auto' }}>
                {dayTasks.map(t => (
                  <div key={t.id} style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.75rem', 
                    padding: '0.125rem 0.25rem', 
                    backgroundColor: t.status === 'Completed' ? 'var(--color-bg-secondary)' : 'rgba(108, 142, 123, 0.1)',
                    color: t.status === 'Completed' ? 'var(--color-text-tertiary)' : 'var(--color-accent-green)',
                    borderRadius: '2px',
                    textDecoration: t.status === 'Completed' ? 'line-through' : 'none'
                  }}>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</span>
                    <button 
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this task?')) {
                          deleteTask(t.id);
                        }
                      }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: '0 2px', opacity: 0.7 }}
                      title="Delete Task"
                    >×</button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <AddTaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        defaultDate={currentMonth}
      />
    </div>
  );
};
