import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../theme';

export interface PriceRangeChipProps {
  minPrice: number;
  maxPrice: number;
  currency?: string;
  size?: 'small' | 'medium';
  style?: ViewStyle;
}

export function PriceRangeChip({
  minPrice,
  maxPrice,
  currency = 'BMD',
  size = 'medium',
  style,
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

  return (
    <View style={[styles.container, styles[`${size}Container`], style]}>
      <Text style={[styles.label, styles[`${size}Label`]]}>Price range:</Text>
      <Text style={[styles.range, styles[`${size}Range`]]}>
        {formatPrice(minPrice)} - {formatPrice(maxPrice)}
      </Text>
      {range > 0.01 && (
        <View style={[styles.badge, styles[`${size}Badge`]]}>
          <Text style={[styles.badgeText, styles[`${size}BadgeText`]]}>
            {percentDiff}% diff
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.background.secondary,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  smallContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  mediumContainer: {},
  label: {
    color: colors.text.secondary,
    fontWeight: '500',
  },
  smallLabel: {
    fontSize: 11,
  },
  mediumLabel: {
    fontSize: 13,
  },
  range: {
    color: colors.text.primary,
    fontWeight: '600',
  },
  smallRange: {
    fontSize: 12,
  },
  mediumRange: {
    fontSize: 14,
  },
  badge: {
    backgroundColor: colors.accent[100],
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  smallBadge: {
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  mediumBadge: {},
  badgeText: {
    color: colors.accent[700],
    fontWeight: '600',
  },
  smallBadgeText: {
    fontSize: 10,
  },
  mediumBadgeText: {
    fontSize: 11,
  },
});
