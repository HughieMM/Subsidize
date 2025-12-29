import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Card } from '@subsidize/ui';
import { Store } from '@subsidize/shared';

export default function StoresScreen() {
  // TODO: Fetch stores from API
  const stores: Store[] = [];

  return (
    <View style={styles.container}>
      {stores.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No stores available yet</Text>
          <Text style={styles.emptySubtext}>
            Stores will appear here once they are added to the system
          </Text>
        </View>
      ) : (
        <FlatList
          data={stores}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.storeItem}>
              <Card>
                <Text style={styles.storeName}>{item.name}</Text>
                {item.description && (
                  <Text style={styles.storeDescription}>{item.description}</Text>
                )}
                <View style={styles.storeFeatures}>
                  {item.offersDelivery && (
                    <Text style={styles.featureTag}>🚚 Delivery</Text>
                  )}
                  {item.acceptsOnlineOrders && (
                    <Text style={styles.featureTag}>🛒 Online Orders</Text>
                  )}
                </View>
              </Card>
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
  listContent: {
    padding: 16,
  },
  storeItem: {
    marginBottom: 16,
  },
  storeName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  storeDescription: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 12,
  },
  storeFeatures: {
    flexDirection: 'row',
    gap: 8,
  },
  featureTag: {
    fontSize: 12,
    color: '#007AFF',
    backgroundColor: '#E5F1FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
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
