import { describe, it, expect } from 'vitest';
import {
  formatPrice,
  calculateSavings,
  calculateSavingsPercentage,
  calculateTax,
} from '../utils/currency';

describe('Currency Utilities', () => {
  describe('formatPrice', () => {
    it('should format price in BMD currency', () => {
      const formatted = formatPrice(10.5);
      expect(formatted).toContain('10.50');
    });

    it('should handle zero price', () => {
      const formatted = formatPrice(0);
      expect(formatted).toContain('0.00');
    });

    it('should format large numbers', () => {
      const formatted = formatPrice(1234.56);
      expect(formatted).toContain('1,234.56');
    });
  });

  describe('calculateSavings', () => {
    it('should calculate correct savings', () => {
      expect(calculateSavings(10, 8)).toBe(2);
    });

    it('should handle zero savings', () => {
      expect(calculateSavings(10, 10)).toBe(0);
    });

    it('should handle negative savings (price increase)', () => {
      expect(calculateSavings(10, 12)).toBe(-2);
    });
  });

  describe('calculateSavingsPercentage', () => {
    it('should calculate correct percentage', () => {
      expect(calculateSavingsPercentage(100, 80)).toBe(20);
    });

    it('should round to nearest integer', () => {
      expect(calculateSavingsPercentage(100, 66.66)).toBe(33);
    });

    it('should handle zero original price', () => {
      expect(calculateSavingsPercentage(0, 0)).toBe(0);
    });

    it('should handle 100% savings', () => {
      expect(calculateSavingsPercentage(100, 0)).toBe(100);
    });
  });

  describe('calculateTax', () => {
    it('should calculate tax with given rate', () => {
      expect(calculateTax(100, 0.1)).toBe(10);
    });

    it('should default to zero tax', () => {
      expect(calculateTax(100)).toBe(0);
    });

    it('should handle zero amount', () => {
      expect(calculateTax(0, 0.1)).toBe(0);
    });
  });
});
