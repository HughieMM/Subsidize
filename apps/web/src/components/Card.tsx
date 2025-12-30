import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'small' | 'medium' | 'large';
}

export function Card({ children, className = '', padding = 'medium' }: CardProps) {
  const paddingStyles = {
    none: 'p-0',
    small: 'p-2',
    medium: 'p-4',
    large: 'p-6',
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-md ${paddingStyles[padding]} ${className}`}
    >
      {children}
    </div>
  );
}
