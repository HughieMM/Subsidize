/**
 * Price Comparison Utilities
 *
 * Provides functions for comparing prices across stores,
 * calculating statistics, and determining best values.
 */

export interface PricePoint {
  storeId: string;
  storeName: string;
  price: number;
  currency?: string;
  unitPrice?: number;
  unitPriceUnit?: string;
  observedAt?: Date | string;
}

export interface PriceStatistics {
  min: number;
  max: number;
  median: number;
  average: number;
  range: number;
  storeCount: number;
}

export interface BestStore {
  storeId: string;
  storeName: string;
  price: number;
  savings?: number; // vs most expensive
  savingsPercent?: number;
}

export interface PriceRange {
  min: PricePoint;
  max: PricePoint;
  spread: number;
  spreadPercent: number;
}

/**
 * Calculate price statistics from price points
 */
export function calculatePriceStats(prices: PricePoint[]): PriceStatistics | null {
  if (prices.length === 0) {
    return null;
  }

  const priceValues = prices.map((p) => p.price).sort((a, b) => a - b);

  const min = priceValues[0];
  const max = priceValues[priceValues.length - 1];
  const sum = priceValues.reduce((acc, val) => acc + val, 0);
  const average = sum / priceValues.length;

  // Calculate median
  const mid = Math.floor(priceValues.length / 2);
  const median =
    priceValues.length % 2 === 0
      ? (priceValues[mid - 1] + priceValues[mid]) / 2
      : priceValues[mid];

  return {
    min,
    max,
    median,
    average: Math.round(average * 100) / 100,
    range: max - min,
    storeCount: prices.length,
  };
}

/**
 * Find the best (lowest price) store
 */
export function findBestStore(prices: PricePoint[]): BestStore | null {
  if (prices.length === 0) {
    return null;
  }

  const sorted = [...prices].sort((a, b) => a.price - b.price);
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];

  const savings = worst.price - best.price;
  const savingsPercent = worst.price > 0 ? (savings / worst.price) * 100 : 0;

  return {
    storeId: best.storeId,
    storeName: best.storeName,
    price: best.price,
    savings,
    savingsPercent: Math.round(savingsPercent * 10) / 10,
  };
}

/**
 * Get price range (min and max stores)
 */
export function getPriceRange(prices: PricePoint[]): PriceRange | null {
  if (prices.length === 0) {
    return null;
  }

  const sorted = [...prices].sort((a, b) => a.price - b.price);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];

  const spread = max.price - min.price;
  const spreadPercent = min.price > 0 ? (spread / min.price) * 100 : 0;

  return {
    min,
    max,
    spread,
    spreadPercent: Math.round(spreadPercent * 10) / 10,
  };
}

/**
 * Parse size string to extract value and unit
 * Examples: "1 lb", "500ml", "12 oz", "2.5kg"
 */
export function parseSize(
  sizeString: string
): { value: number; unit: string } | null {
  if (!sizeString) {
    return null;
  }

  // Common patterns
  const patterns = [
    /(\d+\.?\d*)\s*(lb|lbs|pound|pounds)/i,
    /(\d+\.?\d*)\s*(oz|ounce|ounces)/i,
    /(\d+\.?\d*)\s*(kg|kilogram|kilograms)/i,
    /(\d+\.?\d*)\s*(g|gram|grams)/i,
    /(\d+\.?\d*)\s*(ml|milliliter|milliliters)/i,
    /(\d+\.?\d*)\s*(l|liter|liters)/i,
    /(\d+\.?\d*)\s*(fl oz|fluid ounce|fluid ounces)/i,
    /(\d+\.?\d*)\s*(gal|gallon|gallons)/i,
    /(\d+\.?\d*)\s*(count|ct|pieces?|pcs)/i,
  ];

  for (const pattern of patterns) {
    const match = sizeString.match(pattern);
    if (match) {
      return {
        value: parseFloat(match[1]),
        unit: normalizeUnit(match[2]),
      };
    }
  }

  return null;
}

/**
 * Normalize unit names
 */
function normalizeUnit(unit: string): string {
  const normalized: Record<string, string> = {
    lb: 'lb',
    lbs: 'lb',
    pound: 'lb',
    pounds: 'lb',
    oz: 'oz',
    ounce: 'oz',
    ounces: 'oz',
    kg: 'kg',
    kilogram: 'kg',
    kilograms: 'kg',
    g: 'g',
    gram: 'g',
    grams: 'g',
    ml: 'ml',
    milliliter: 'ml',
    milliliters: 'ml',
    l: 'l',
    liter: 'l',
    liters: 'l',
    'fl oz': 'fl oz',
    'fluid ounce': 'fl oz',
    'fluid ounces': 'fl oz',
    gal: 'gal',
    gallon: 'gal',
    gallons: 'gal',
    count: 'count',
    ct: 'count',
    piece: 'count',
    pieces: 'count',
    pcs: 'count',
  };

  return normalized[unit.toLowerCase()] || unit;
}

/**
 * Calculate unit price (e.g., price per kg, price per 100g)
 */
export function calculateUnitPrice(
  price: number,
  sizeValue: number,
  sizeUnit: string,
  targetUnit?: string
): { unitPrice: number; unitPriceUnit: string } | null {
  if (!sizeValue || sizeValue <= 0) {
    return null;
  }

  // Convert to base units
  const baseValue = convertToBaseUnit(sizeValue, sizeUnit);
  if (!baseValue) {
    return null;
  }

  const { value, unit } = baseValue;

  // Calculate price per base unit
  const pricePerUnit = price / value;

  // Determine display unit
  let displayValue: number;
  let displayUnit: string;

  if (targetUnit) {
    displayValue = pricePerUnit;
    displayUnit = targetUnit;
  } else if (unit === 'g' && value > 100) {
    // For grams, show per 100g if > 100g
    displayValue = pricePerUnit * 100;
    displayUnit = '100g';
  } else if (unit === 'ml' && value > 100) {
    // For ml, show per 100ml if > 100ml
    displayValue = pricePerUnit * 100;
    displayUnit = '100ml';
  } else {
    displayValue = pricePerUnit;
    displayUnit = unit;
  }

  return {
    unitPrice: Math.round(displayValue * 100) / 100,
    unitPriceUnit: displayUnit,
  };
}

/**
 * Convert size to base unit for comparison
 */
function convertToBaseUnit(
  value: number,
  unit: string
): { value: number; unit: string } | null {
  const conversions: Record<string, { value: number; unit: string }> = {
    // Weight - convert to grams
    lb: { value: value * 453.592, unit: 'g' },
    oz: { value: value * 28.3495, unit: 'g' },
    kg: { value: value * 1000, unit: 'g' },
    g: { value: value, unit: 'g' },

    // Volume - convert to ml
    l: { value: value * 1000, unit: 'ml' },
    ml: { value: value, unit: 'ml' },
    gal: { value: value * 3785.41, unit: 'ml' },
    'fl oz': { value: value * 29.5735, unit: 'ml' },

    // Count
    count: { value: value, unit: 'count' },
  };

  return conversions[unit] || null;
}

/**
 * Format price range for display
 */
export function formatPriceRange(range: PriceRange, currency = 'BMD'): string {
  const symbol = getCurrencySymbol(currency);
  return `${symbol}${range.min.price.toFixed(2)} - ${symbol}${range.max.price.toFixed(2)}`;
}

/**
 * Format unit price for display
 */
export function formatUnitPrice(
  unitPrice: number,
  unit: string,
  currency = 'BMD'
): string {
  const symbol = getCurrencySymbol(currency);
  return `${symbol}${unitPrice.toFixed(2)}/${unit}`;
}

/**
 * Get currency symbol
 */
function getCurrencySymbol(currency: string): string {
  const symbols: Record<string, string> = {
    BMD: '$',
    USD: '$',
    EUR: '€',
    GBP: '£',
  };
  return symbols[currency] || currency;
}

/**
 * Compare basket totals across stores
 */
export interface BasketTotal {
  storeId: string;
  storeName: string;
  total: number;
  itemCount: number;
  missingItems: string[];
  hasAllItems: boolean;
}

export function compareBasketTotals(
  totals: BasketTotal[]
): {
  best: BasketTotal | null;
  totals: BasketTotal[];
  savings: number;
} {
  if (totals.length === 0) {
    return { best: null, totals: [], savings: 0 };
  }

  // Only consider stores with all items
  const complete = totals.filter((t) => t.hasAllItems);

  if (complete.length === 0) {
    // If no store has all items, find the one with most items
    const sorted = [...totals].sort((a, b) => b.itemCount - a.itemCount);
    return { best: sorted[0], totals, savings: 0 };
  }

  // Find cheapest among complete stores
  const sorted = [...complete].sort((a, b) => a.total - b.total);
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];
  const savings = worst.total - best.total;

  return { best, totals, savings };
}
