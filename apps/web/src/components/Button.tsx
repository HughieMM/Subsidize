import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  className?: string;
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  className = '',
}: ButtonProps) {
  const baseStyles = 'font-semibold rounded-lg transition-colors duration-200';

  const variantStyles = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600 disabled:bg-neutral-400',
    secondary: 'bg-secondary-500 text-white hover:bg-secondary-600 disabled:bg-neutral-400',
    outline:
      'bg-transparent border border-primary-500 text-primary-500 hover:bg-primary-50 disabled:border-neutral-400 disabled:text-neutral-400',
  };

  const sizeStyles = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </button>
  );
}
