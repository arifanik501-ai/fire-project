import React from 'react';
import { Menu, Search, Bell, Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import './layout.css';

interface TopbarProps {
  onToggleSidebar: () => void;
  onOpenAddTask: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onToggleSidebar, onOpenAddTask }) => {
  return (
    <header className="topbar">
      <div className="flex items-center gap-4" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button 
          className="mobile-menu-btn" 
          onClick={onToggleSidebar}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-primary)' }}
        >
          <Menu size={24} />
        </button>
        <div className="search-container" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={18} style={{ position: 'absolute', left: '10px', color: 'var(--color-text-tertiary)' }} />
          <input 
            type="text" 
            placeholder="Search tasks..." 
            className="input-field topbar-search-input"
            style={{ paddingLeft: '36px', background: 'var(--color-bg-secondary)' }}
          />
        </div>
      </div>
      
      <div className="topbar-actions">
        <Button variant="primary" size="sm" icon={<Plus size={18} />} onClick={onOpenAddTask}>
          Add Task
        </Button>
        <Button variant="ghost" size="sm" icon={<Bell size={20} />} aria-label="Notifications" />
        <div 
          className="user-avatar"
          style={{ 
            width: '36px', height: '36px', borderRadius: '50%', 
            backgroundColor: 'var(--color-accent-orange)', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: '600', fontSize: '14px', cursor: 'pointer'
          }}
        >
          ME
        </div>
      </div>
    </header>
  );
};
