import React, { useState } from 'react';
import { DragDropContext, Droppable, type DropResult } from '@hello-pangea/dnd';
import { format, addDays, subDays } from 'date-fns';
import { Plus } from 'lucide-react';
import { TaskCard } from '../components/tasks/TaskCard';
import { AddTaskModal } from '../components/tasks/AddTaskModal';
import { Button } from '../components/ui/Button';
import { useTaskStore } from '../store/useTaskStore';
import type { TimeOfDay } from '../types';

export const DailyTasks: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const tasks = useTaskStore((state) => state.tasks);
  const updateTask = useTaskStore((state) => state.updateTask);

  const dateStr = format(currentDate, 'yyyy-MM-dd');
  const todaysTasks = tasks.filter((t) => t.date === dateStr);

  const columns: { id: TimeOfDay; title: string }[] = [
    { id: 'Morning', title: 'Morning (6am - 12pm)' },
    { id: 'Afternoon', title: 'Afternoon (12pm - 6pm)' },
    { id: 'Evening', title: 'Evening (6pm - 10pm)' },
    { id: 'Night', title: 'Night (10pm - 6am)' },
  ];

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    if (destination.droppableId !== source.droppableId) {
      updateTask(draggableId, { timeOfDay: destination.droppableId as TimeOfDay });
    }
  };

  return (
    <div className="page-wrapper">
      <header className="page-header">
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Daily Tasks</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            {format(currentDate, 'EEEE, MMMM do yyyy')}
          </p>
        </div>
        <div className="page-header-actions">
          <Button variant="secondary" onClick={() => setCurrentDate(subDays(currentDate, 1))}>Prev Day</Button>
          <Button variant="secondary" onClick={() => setCurrentDate(new Date())}>Today</Button>
          <Button variant="secondary" onClick={() => setCurrentDate(addDays(currentDate, 1))}>Next Day</Button>
          <Button icon={<Plus size={18} />} onClick={() => setIsModalOpen(true)}>Add Task</Button>
        </div>
      </header>

      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: 'flex', gap: '1.5rem', flex: 1, overflowX: 'auto', paddingBottom: '1rem' }}>
          {columns.map((col) => {
            const colTasks = todaysTasks.filter((t) => t.timeOfDay === col.id);
            
            return (
              <div key={col.id} style={{ flex: '1 1 300px', minWidth: '280px', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1rem' }}>{col.title}</h3>
                  <span style={{ fontSize: '0.875rem', color: 'var(--color-text-tertiary)' }}>{colTasks.length}</span>
                </div>
                
                <Droppable droppableId={col.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{ 
                        flex: 1, 
                        minHeight: '100px',
                        transition: 'background-color 0.2s ease',
                        backgroundColor: snapshot.isDraggingOver ? 'var(--color-bg-tertiary)' : 'transparent',
                        borderRadius: 'var(--radius-sm)'
                      }}
                    >
                      {colTasks.map((task, index) => (
                        <TaskCard key={task.id} task={task} index={index} />
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      <AddTaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        defaultDate={currentDate}
      />
    </div>
  );
};
