import React from 'react';

export interface BestStoreBadgeProps {
  storeName: string;
  price: number;
  savings?: number;
  currency?: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export function BestStoreBadge({
  storeName,
  price,
  savings,
  currency = 'BMD',
  size = 'medium',
  className = '',
}: BestStoreBadgeProps) {
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-BM', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const sizeClasses = {
    small: {
      container: 'px-2 py-1.5 rounded-md',
      icon: 'w-6 h-6 text-xs',
      label: 'text-[10px]',
      storeName: 'text-xs',
      savings: 'text-[11px] mt-0.5',
    },
    medium: {
      container: 'px-3 py-2.5 rounded-lg',
      icon: 'w-8 h-8 text-base',
      label: 'text-xs',
      storeName: 'text-sm',
      savings: 'text-xs mt-0.5',
    },
    large: {
      container: 'px-4 py-3 rounded-xl',
      icon: 'w-10 h-10 text-lg',
      label: 'text-sm',
      storeName: 'text-base',
      savings: 'text-sm mt-1',
    },
  };

  const classes = sizeClasses[size];

  return (
    <div
      className={`flex items-center gap-2.5 bg-success-50 border border-success-200 ${classes.container} ${className}`}
    >
      <div
        className={`flex items-center justify-center bg-success-100 rounded-full flex-shrink-0 ${classes.icon}`}
      >
        <span>🏆</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className={`text-success-700 font-semibold ${classes.label}`}>
          Best price
        </div>
        <div className={`text-text-primary font-bold truncate ${classes.storeName}`}>
          {storeName} · {formatPrice(price)}
        </div>
        {savings !== undefined && savings > 0.01 && (
          <div className={`text-success-600 font-semibold ${classes.savings}`}>
            Save {formatPrice(savings)}
          </div>
        )}
      </div>
    </div>
  );
}
