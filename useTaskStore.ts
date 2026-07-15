import { create } from 'zustand';
import { ref, set as setFirebase, update as updateFirebase, remove as removeFirebase, onValue } from 'firebase/database';
import { db } from '../services/firebase';
import type { Task, UserSettings } from '../types';

interface TaskState {
  tasks: Task[];
  settings: UserSettings;
  
  // Actions
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  updateSettings: (updates: Partial<UserSettings>) => void;
  setTasks: (tasks: Task[]) => void;
}

const defaultSettings: UserSettings = {
  theme: 'system',
  accentColor: 'var(--color-accent-green)',
  fontSize: 'medium',
  reminderSettings: true,
  startOfWeek: 1,
};

// Initialize Firebase Sync
let isInitialized = false;

export const useTaskStore = create<TaskState>((set) => {
  
  if (!isInitialized) {
    const tasksRef = ref(db, 'tasks');
    onValue(tasksRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const taskList = Object.values(data) as Task[];
        set({ tasks: taskList });
      } else {
        set({ tasks: [] });
      }
    });
    isInitialized = true;
  }

  return {
    tasks: [],
    settings: defaultSettings,

    addTask: (task) => {
      // Optimistic update
      set((state) => ({ tasks: [...state.tasks, task] }));
      // Push to Firebase instantly
      setFirebase(ref(db, `tasks/${task.id}`), task).catch(console.error);
    },
    
    updateTask: (id, updates) => {
      // Optimistic update
      set((state) => ({
        tasks: state.tasks.map((task) => (task.id === id ? { ...task, ...updates } : task)),
      }));
      // Push to Firebase instantly
      updateFirebase(ref(db, `tasks/${id}`), updates).catch(console.error);
    },
    
    deleteTask: (id) => {
      // Optimistic update
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
      }));
      // Push to Firebase instantly
      removeFirebase(ref(db, `tasks/${id}`)).catch(console.error);
    },
    
    updateSettings: (updates) => {
      // Local settings
      set((state) => ({ settings: { ...state.settings, ...updates } }));
    },
    
    setTasks: (tasks) => set({ tasks }),
  };
});
