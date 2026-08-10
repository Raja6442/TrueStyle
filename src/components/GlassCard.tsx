import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  hoverable = true 
}) => {
  const hoverClass = hoverable ? 'glass-card-hover' : '';
  
  return (
    <div className={`glass-card shadow-glass shadow-glass-highlight rounded-2xl p-6 ${hoverClass} ${className}`}>
      {children}
    </div>
  );
};
