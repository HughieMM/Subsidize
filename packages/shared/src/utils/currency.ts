/**
 * Format a price in Bermuda Dollars (BMD)
 */
export function formatPrice(amount: number, currency: string = 'BMD'): string {
  return new Intl.NumberFormat('en-BM', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Calculate savings between two prices
 */
export function calculateSavings(originalPrice: number, salePrice: number): number {
  return originalPrice - salePrice;
}

/**
 * Calculate savings percentage
 */
export function calculateSavingsPercentage(originalPrice: number, salePrice: number): number {
  if (originalPrice === 0) return 0;
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
}

/**
 * Calculate tax (Bermuda has no sales tax, but this is here for potential future use)
 */
export function calculateTax(amount: number, taxRate: number = 0): number {
  return amount * taxRate;
}
