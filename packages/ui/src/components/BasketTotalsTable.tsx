import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../theme';

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
  style?: ViewStyle;
}

export function BasketTotalsTable({
  totals,
  currency = 'BMD',
  style,
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
    <View style={[styles.container, style]}>
      <Text style={styles.title}>Compare basket totals</Text>

      {sortedTotals.map((storeTotal, index) => (
        <View
          key={storeTotal.storeId}
          style={[
            styles.row,
            storeTotal.isBest && styles.bestRow,
            index === sortedTotals.length - 1 && styles.lastRow,
          ]}
        >
          <View style={styles.storeInfo}>
            <View style={styles.storeHeader}>
              <Text style={[styles.storeName, storeTotal.isBest && styles.bestStoreName]}>
                {storeTotal.storeName}
              </Text>
              {storeTotal.isBest && <Text style={styles.bestBadge}>🏆 Best</Text>}
            </View>
            <View style={styles.itemsInfo}>
              <Text style={styles.itemsText}>
                {storeTotal.itemsFound} of {storeTotal.itemsFound + storeTotal.itemsMissing} items
              </Text>
              {storeTotal.itemsMissing > 0 && (
                <Text style={styles.missingText}>
                  ({storeTotal.itemsMissing} missing)
                </Text>
              )}
            </View>
          </View>

          <View style={styles.priceInfo}>
            <Text style={[styles.total, storeTotal.isBest && styles.bestTotal]}>
              {formatPrice(storeTotal.total)}
            </Text>
            {storeTotal.savings !== undefined && storeTotal.savings > 0.01 && (
              <Text style={styles.savings}>+{formatPrice(storeTotal.savings)}</Text>
            )}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.primary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border.light,
    overflow: 'hidden',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
    padding: 16,
    backgroundColor: colors.background.secondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  bestRow: {
    backgroundColor: colors.success[50],
  },
  storeInfo: {
    flex: 1,
  },
  storeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  bestStoreName: {
    color: colors.success[700],
    fontWeight: '700',
  },
  bestBadge: {
    fontSize: 12,
    color: colors.success[700],
    fontWeight: '600',
  },
  itemsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  itemsText: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  missingText: {
    fontSize: 12,
    color: colors.error[500],
    fontWeight: '500',
  },
  priceInfo: {
    alignItems: 'flex-end',
  },
  total: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
  },
  bestTotal: {
    color: colors.success[700],
    fontSize: 20,
  },
  savings: {
    fontSize: 13,
    color: colors.text.tertiary,
    marginTop: 2,
  },
});
