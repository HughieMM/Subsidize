import React from 'react';

export interface PriceRangeChipProps {
  minPrice: number;
  maxPrice: number;
  currency?: string;
  size?: 'small' | 'medium';
  className?: string;
}

export function PriceRangeChip({
  minPrice,
  maxPrice,
  currency = 'BMD',
  size = 'medium',
  className = '',
}: PriceRangeChipProps) {
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-BM', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const range = maxPrice - minPrice;
  const percentDiff = ((range / minPrice) * 100).toFixed(0);

  const sizeClasses = {
    small: 'text-xs px-2 py-1',
    medium: 'text-sm px-3 py-1.5',
  };

  const badgeSizeClasses = {
    small: 'text-[10px] px-1.5 py-0.5',
    medium: 'text-[11px] px-2 py-0.5',
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 bg-surface rounded-md ${sizeClasses[size]} ${className}`}
    >
      <span className="text-text-secondary font-medium">Price range:</span>
      <span className="text-text-primary font-semibold">
        {formatPrice(minPrice)} - {formatPrice(maxPrice)}
      </span>
      {range > 0.01 && (
        <span
          className={`bg-accent-100 text-accent-700 font-semibold rounded ${badgeSizeClasses[size]}`}
        >
          {percentDiff}% diff
        </span>
      )}
    </div>
  );
}
