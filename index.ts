export type Priority = 'Low' | 'Medium' | 'High' | 'Critical';
export type TaskStatus = 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
export type RepeatType = 'None' | 'Daily' | 'Weekdays' | 'Weekly' | 'Monthly' | 'Yearly' | 'Custom';
export type TimeOfDay = 'Morning' | 'Afternoon' | 'Evening' | 'Night';

export interface Task {
  id: string;
  title: string;
  description?: string;
  date: string; // ISO format YYYY-MM-DD
  deadline?: string; // ISO format
  repeat: RepeatType;
  status: TaskStatus;
  priority: Priority;
  category: string;
  notes?: string;
  tags: string[];
  reminder?: string;
  timeOfDay: TimeOfDay;
  createdAt: number;
  updatedAt: number;
  completedAt?: number;
  userId: string;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  accentColor: string;
  fontSize: 'small' | 'medium' | 'large';
  reminderSettings: boolean;
  startOfWeek: 0 | 1; // 0 = Sunday, 1 = Monday
}
