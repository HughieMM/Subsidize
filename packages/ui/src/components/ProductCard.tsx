import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { ProductWithPrices, formatPrice } from '@subsidize/shared';
import { Card } from './Card';

export interface ProductCardProps {
  product: ProductWithPrices;
  onPress?: () => void;
}

export function ProductCard({ product, onPress }: ProductCardProps) {
  const lowestPrice = product.lowestPrice;
  const hasMultiplePrices = product.prices.length > 1;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} disabled={!onPress}>
      <Card padding="none">
        <View style={styles.container}>
          {product.imageUrl && (
            <Image source={{ uri: product.imageUrl }} style={styles.image} />
          )}
          <View style={styles.content}>
            <Text style={styles.name} numberOfLines={2}>
              {product.name}
            </Text>
            {product.brand && (
              <Text style={styles.brand} numberOfLines={1}>
                {product.brand}
              </Text>
            )}
            {lowestPrice && (
              <View style={styles.priceContainer}>
                <Text style={styles.price}>
                  {formatPrice(lowestPrice.isOnSale && lowestPrice.salePrice
                    ? lowestPrice.salePrice
                    : lowestPrice.price)}
                </Text>
                {lowestPrice.isOnSale && lowestPrice.salePrice && (
                  <Text style={styles.originalPrice}>
                    {formatPrice(lowestPrice.price)}
                  </Text>
                )}
              </View>
            )}
            {hasMultiplePrices && (
              <Text style={styles.compareText}>
                Compare {product.prices.length} stores
              </Text>
            )}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 150,
    backgroundColor: '#F2F2F7',
  },
  content: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  brand: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#007AFF',
  },
  originalPrice: {
    fontSize: 14,
    color: '#8E8E93',
    textDecorationLine: 'line-through',
  },
  compareText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
});
