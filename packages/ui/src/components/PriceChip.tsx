import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../theme';

export interface PriceChipProps {
  price: number;
  originalPrice?: number;
  currency?: string;
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

export function PriceChip({
  price,
  originalPrice,
  currency = 'BMD',
  size = 'medium',
  style,
}: PriceChipProps) {
  const isOnSale = originalPrice !== undefined && originalPrice > price;
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-BM', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  return (
    <View style={[styles.container, styles[`${size}Container`], style]}>
      <Text style={[styles.price, styles[`${size}Price`], isOnSale && styles.salePrice]}>
        {formatPrice(price)}
      </Text>
      {isOnSale && (
        <Text style={[styles.originalPrice, styles[`${size}OriginalPrice`]]}>
          {formatPrice(originalPrice)}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  // Size variants
  smallContainer: {},
  mediumContainer: {},
  largeContainer: {},
  // Price styles
  price: {
    fontWeight: '700',
    color: colors.primary[600],
  },
  smallPrice: {
    fontSize: 14,
  },
  mediumPrice: {
    fontSize: 18,
  },
  largePrice: {
    fontSize: 24,
  },
  salePrice: {
    color: colors.accent[500],
  },
  // Original price
  originalPrice: {
    textDecorationLine: 'line-through',
    color: colors.text.tertiary,
    fontWeight: '400',
  },
  smallOriginalPrice: {
    fontSize: 12,
  },
  mediumOriginalPrice: {
    fontSize: 14,
  },
  largeOriginalPrice: {
    fontSize: 16,
  },
});
