import React from 'react';
import { View, Text, FlatList, StyleSheet, TextInput } from 'react-native';
import { ProductCard } from '@subsidize/ui';
import { ProductWithPrices } from '@subsidize/shared';

export default function ProductsScreen() {
  const [searchQuery, setSearchQuery] = React.useState('');

  // TODO: Fetch products from API
  const products: ProductWithPrices[] = [];

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      {products.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No products available yet</Text>
          <Text style={styles.emptySubtext}>
            Products will appear here once stores are scraped
          </Text>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.productItem}>
              <ProductCard product={item} />
            </View>
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  searchInput: {
    height: 40,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  listContent: {
    padding: 16,
  },
  productItem: {
    marginBottom: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
});
