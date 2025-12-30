import React from 'react';
import { ProductWithPrices, formatPrice } from '@subsidize/shared';
import { Card } from './Card';

interface ProductCardProps {
  product: ProductWithPrices;
  onClick?: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const lowestPrice = product.lowestPrice;
  const hasMultiplePrices = product.prices.length > 1;

  return (
    <Card
      padding="none"
      className={onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}
    >
      <div onClick={onClick}>
        {product.imageUrl && (
          <div className="w-full h-40 bg-surface rounded-t-xl" />
        )}
        <div className="p-3">
          <h3 className="text-base font-semibold text-text-primary mb-1 line-clamp-2">
            {product.name}
          </h3>
          {product.brand && (
            <p className="text-sm text-text-secondary mb-2">{product.brand}</p>
          )}
          {lowestPrice && (
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg font-bold text-primary-600">
                {formatPrice(
                  lowestPrice.isOnSale && lowestPrice.salePrice
                    ? lowestPrice.salePrice
                    : lowestPrice.price
                )}
              </span>
              {lowestPrice.isOnSale && lowestPrice.salePrice && (
                <span className="text-sm text-text-tertiary line-through">
                  {formatPrice(lowestPrice.price)}
                </span>
              )}
            </div>
          )}
          {hasMultiplePrices && (
            <p className="text-xs text-primary-500 font-medium">
              Compare {product.prices.length} stores
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
