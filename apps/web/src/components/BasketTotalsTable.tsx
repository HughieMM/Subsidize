import React from 'react';

export interface StoreTotal {
  storeId: string;
  storeName: string;
  total: number;
  itemsFound: number;
  itemsMissing: number;
  savings?: number;
  isBest?: boolean;
}

export interface BasketTotalsTableProps {
  totals: StoreTotal[];
  currency?: string;
  className?: string;
}

export function BasketTotalsTable({
  totals,
  currency = 'BMD',
  className = '',
}: BasketTotalsTableProps) {
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-BM', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const sortedTotals = [...totals].sort((a, b) => {
    // Best store first
    if (a.isBest && !b.isBest) return -1;
    if (!a.isBest && b.isBest) return 1;
    // Then by total price
    return a.total - b.total;
  });

  return (
    <div className={`bg-white rounded-lg border border-border overflow-hidden ${className}`}>
      <div className="px-4 py-3 bg-surface border-b border-border">
        <h3 className="text-base font-bold text-text-primary">
          Compare basket totals
        </h3>
      </div>

      {sortedTotals.map((storeTotal, index) => (
        <div
          key={storeTotal.storeId}
          className={`
            flex items-center justify-between px-4 py-4
            ${index < sortedTotals.length - 1 ? 'border-b border-border' : ''}
            ${storeTotal.isBest ? 'bg-success-50' : ''}
          `}
        >
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`font-semibold ${
                  storeTotal.isBest ? 'text-success-700 text-base' : 'text-text-primary'
                }`}
              >
                {storeTotal.storeName}
              </span>
              {storeTotal.isBest && (
                <span className="text-xs text-success-700 font-semibold">
                  🏆 Best
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm text-text-secondary">
                {storeTotal.itemsFound} of {storeTotal.itemsFound + storeTotal.itemsMissing}{' '}
                items
              </span>
              {storeTotal.itemsMissing > 0 && (
                <span className="text-xs text-error-500 font-medium">
                  ({storeTotal.itemsMissing} missing)
                </span>
              )}
            </div>
          </div>

          <div className="text-right">
            <div
              className={`font-bold ${
                storeTotal.isBest
                  ? 'text-success-700 text-xl'
                  : 'text-text-primary text-lg'
              }`}
            >
              {formatPrice(storeTotal.total)}
            </div>
            {storeTotal.savings !== undefined && storeTotal.savings > 0.01 && (
              <div className="text-sm text-text-tertiary mt-0.5">
                +{formatPrice(storeTotal.savings)}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
