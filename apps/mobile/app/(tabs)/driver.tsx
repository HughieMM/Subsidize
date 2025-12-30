import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { Button, Card } from '@subsidize/ui';

interface DeliveryOrder {
  id: string;
  status: string;
  basketSnapshot: {
    items: Array<{
      productName: string;
      quantity: number;
      price: number;
    }>;
  };
  feeBreakdown: {
    total: number;
    deliveryFee: number;
    commission: number;
  };
  deliveryAddress: string;
  timeWindow?: string;
  notes?: string;
  createdAt: string;
}

// Mock driver ID for demo purposes
const DRIVER_ID = 'driver-1';

export default function DriverModeScreen() {
  const [orders, setOrders] = useState<DeliveryOrder[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'open' | 'my' | 'all'>('open');

  const fetchOrders = async () => {
    try {
      let url = 'http://localhost:3001/api/delivery/orders';

      if (filter === 'open') {
        url += '?status=created';
      } else if (filter === 'my') {
        url += `?driverId=${DRIVER_ID}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      Alert.alert('Error', 'Failed to load orders');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const handleAcceptOrder = async (orderId: string) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/delivery/orders/${orderId}/accept`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            driverId: DRIVER_ID,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to accept order');
      }

      Alert.alert('Success', 'Order accepted!');
      fetchOrders();
    } catch (error) {
      console.error('Error accepting order:', error);
      Alert.alert('Error', 'Failed to accept order');
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/delivery/orders/${orderId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      Alert.alert('Success', `Order status updated to ${newStatus}`);
      fetchOrders();
    } catch (error) {
      console.error('Error updating status:', error);
      Alert.alert('Error', 'Failed to update order status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'created':
        return '#007AFF';
      case 'accepted':
        return '#FF9500';
      case 'shopping':
        return '#5856D6';
      case 'delivering':
        return '#AF52DE';
      case 'complete':
        return '#34C759';
      case 'cancelled':
        return '#FF3B30';
      default:
        return '#8E8E93';
    }
  };

  const getNextStatus = (currentStatus: string): string | null => {
    const statusFlow = {
      accepted: 'shopping',
      shopping: 'delivering',
      delivering: 'complete',
    };
    return statusFlow[currentStatus] || null;
  };

  const renderOrder = ({ item }: { item: DeliveryOrder }) => {
    const nextStatus = getNextStatus(item.status);
    const itemCount = item.basketSnapshot.items.reduce(
      (sum, i) => sum + i.quantity,
      0
    );

    return (
      <Card style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderId}>Order #{item.id.slice(0, 8)}</Text>
            <Text style={styles.orderTime}>
              {new Date(item.createdAt).toLocaleString()}
            </Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(item.status) },
            ]}
          >
            <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.orderDetails}>
          <Text style={styles.detailLabel}>Items: {itemCount}</Text>
          <Text style={styles.detailLabel}>
            Total: ${item.feeBreakdown.total.toFixed(2)}
          </Text>
          <Text style={styles.detailLabel}>
            Your Commission: ${item.feeBreakdown.commission?.toFixed(2) || '0.00'}
          </Text>
        </View>

        <View style={styles.addressSection}>
          <Text style={styles.addressLabel}>Delivery Address:</Text>
          <Text style={styles.addressText}>{item.deliveryAddress}</Text>
          {item.timeWindow && (
            <Text style={styles.timeWindow}>⏰ {item.timeWindow}</Text>
          )}
          {item.notes && (
            <Text style={styles.notes}>📝 {item.notes}</Text>
          )}
        </View>

        <View style={styles.actions}>
          {item.status === 'created' && (
            <Button onPress={() => handleAcceptOrder(item.id)}>
              Accept Order
            </Button>
          )}

          {nextStatus && (
            <Button
              onPress={() => handleUpdateStatus(item.id, nextStatus)}
              variant="secondary"
            >
              Mark as {nextStatus}
            </Button>
          )}

          {item.status !== 'complete' && item.status !== 'cancelled' && (
            <TouchableOpacity
              onPress={() => handleUpdateStatus(item.id, 'cancelled')}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelText}>Cancel Order</Text>
            </TouchableOpacity>
          )}
        </View>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Driver Mode 🚗</Text>
        <View style={styles.filters}>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'open' && styles.filterActive]}
            onPress={() => setFilter('open')}
          >
            <Text
              style={[
                styles.filterText,
                filter === 'open' && styles.filterTextActive,
              ]}
            >
              Open Orders
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'my' && styles.filterActive]}
            onPress={() => setFilter('my')}
          >
            <Text
              style={[
                styles.filterText,
                filter === 'my' && styles.filterTextActive,
              ]}
            >
              My Orders
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'all' && styles.filterActive]}
            onPress={() => setFilter('all')}
          >
            <Text
              style={[
                styles.filterText,
                filter === 'all' && styles.filterTextActive,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrder}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No orders found</Text>
            <Text style={styles.emptySubtext}>
              {filter === 'open'
                ? 'No open orders available'
                : filter === 'my'
                ? "You haven't accepted any orders yet"
                : 'No orders in the system'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#D1D1D6',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 16,
  },
  filters: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F2F2F7',
  },
  filterActive: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3C3C43',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: 16,
  },
  orderCard: {
    marginBottom: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  orderTime: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  orderDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#3C3C43',
  },
  addressSection: {
    backgroundColor: '#F2F2F7',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  addressLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 15,
    color: '#000000',
    marginBottom: 6,
  },
  timeWindow: {
    fontSize: 14,
    color: '#007AFF',
    marginTop: 4,
  },
  notes: {
    fontSize: 14,
    color: '#5856D6',
    marginTop: 4,
  },
  actions: {
    gap: 8,
  },
  cancelButton: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 14,
    color: '#FF3B30',
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    marginTop: 80,
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
