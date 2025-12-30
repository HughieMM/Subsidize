import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../theme';

export interface BestStoreBadgeProps {
  storeName: string;
  price: number;
  savings?: number;
  currency?: string;
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

export function BestStoreBadge({
  storeName,
  price,
  savings,
  currency = 'BMD',
  size = 'medium',
  style,
}: BestStoreBadgeProps) {
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-BM', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <View style={[styles.container, styles[`${size}Container`], style]}>
      <View style={[styles.iconContainer, styles[`${size}IconContainer`]]}>
        <Text style={[styles.icon, styles[`${size}Icon`]]}>🏆</Text>
      </View>
      <View style={styles.content}>
        <Text style={[styles.label, styles[`${size}Label`]]}>Best price</Text>
        <Text style={[styles.storeName, styles[`${size}StoreName`]]} numberOfLines={1}>
          {storeName} · {formatPrice(price)}
        </Text>
        {savings !== undefined && savings > 0.01 && (
          <Text style={[styles.savings, styles[`${size}Savings`]]}>
            Save {formatPrice(savings)}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.success[50],
    borderColor: colors.success[200],
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  smallContainer: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 6,
  },
  mediumContainer: {},
  largeContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    gap: 12,
  },
  iconContainer: {
    backgroundColor: colors.success[100],
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  mediumIconContainer: {},
  largeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  icon: {
    fontSize: 16,
  },
  smallIcon: {
    fontSize: 12,
  },
  mediumIcon: {},
  largeIcon: {
    fontSize: 20,
  },
  content: {
    flex: 1,
  },
  label: {
    color: colors.success[700],
    fontWeight: '600',
    marginBottom: 2,
  },
  smallLabel: {
    fontSize: 10,
    marginBottom: 1,
  },
  mediumLabel: {
    fontSize: 12,
  },
  largeLabel: {
    fontSize: 14,
    marginBottom: 3,
  },
  storeName: {
    color: colors.text.primary,
    fontWeight: '700',
  },
  smallStoreName: {
    fontSize: 13,
  },
  mediumStoreName: {
    fontSize: 15,
  },
  largeStoreName: {
    fontSize: 17,
  },
  savings: {
    color: colors.success[600],
    fontWeight: '600',
    marginTop: 2,
  },
  smallSavings: {
    fontSize: 11,
    marginTop: 1,
  },
  mediumSavings: {
    fontSize: 12,
  },
  largeSavings: {
    fontSize: 14,
    marginTop: 3,
  },
});
