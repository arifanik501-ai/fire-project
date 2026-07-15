import React from 'react';

export const PlaceholderView: React.FC<{ title: string }> = ({ title }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
    <h1 style={{ color: 'var(--color-text-tertiary)', fontWeight: 400 }}>{title} View (Coming Soon)</h1>
  </div>
);
