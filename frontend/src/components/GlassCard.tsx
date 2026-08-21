import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  hoverable = true,
  onClick
}) => {
  const hoverClass = hoverable ? 'glass-card-hover' : '';
  
  return (
    <div 
      className={`glass-card shadow-glass shadow-glass-highlight rounded-2xl p-6 ${hoverClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
