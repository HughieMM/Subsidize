import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Button } from '@subsidize/ui';

interface DeliveryOrderScreenProps {
  basketId: string;
  onOrderCreated?: (orderId: string) => void;
  onCancel?: () => void;
}

export function DeliveryOrderScreen({
  basketId,
  onOrderCreated,
  onCancel,
}: DeliveryOrderScreenProps) {
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [timeWindow, setTimeWindow] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!deliveryAddress.trim()) {
      Alert.alert('Missing Information', 'Please enter a delivery address');
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Replace with actual API call
      const response = await fetch('http://localhost:3001/api/delivery/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          basketId,
          deliveryAddress: deliveryAddress.trim(),
          timeWindow: timeWindow.trim() || null,
          notes: notes.trim() || null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const data = await response.json();

      Alert.alert(
        'Order Created!',
        `Your delivery order has been created. Total: ${data.order.feeBreakdown.total.toFixed(2)}`,
        [
          {
            text: 'OK',
            onPress: () => onOrderCreated?.(data.order.id),
          },
        ]
      );
    } catch (error) {
      console.error('Error creating order:', error);
      Alert.alert(
        'Order Failed',
        'Failed to create delivery order. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Delivery Details</Text>

        <View style={styles.section}>
          <Text style={styles.label}>
            Delivery Address <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter your full delivery address"
            value={deliveryAddress}
            onChangeText={setDeliveryAddress}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Preferred Time Window</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Today 2-4pm, Tomorrow morning"
            value={timeWindow}
            onChangeText={setTimeWindow}
          />
          <Text style={styles.hint}>Optional - helps us deliver when you're available</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Special Instructions</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Any special instructions for the driver?"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
          <Text style={styles.hint}>
            e.g., Leave at door, Ring doorbell, etc.
          </Text>
        </View>

        <View style={styles.feeInfo}>
          <Text style={styles.feeTitle}>Estimated Fees</Text>
          <View style={styles.feeRow}>
            <Text style={styles.feeLabel}>Delivery Fee</Text>
            <Text style={styles.feeValue}>$5.00</Text>
          </View>
          <View style={styles.feeRow}>
            <Text style={styles.feeLabel}>Service Fee</Text>
            <Text style={styles.feeValue}>$2.50</Text>
          </View>
          <View style={[styles.feeRow, styles.feeTotal]}>
            <Text style={styles.feeTotalLabel}>Additional Fees</Text>
            <Text style={styles.feeTotalValue}>$7.50</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Button
            onPress={handleSubmit}
            disabled={isSubmitting}
            style={styles.submitButton}
          >
            {isSubmitting ? 'Creating Order...' : 'Place Delivery Order'}
          </Button>

          {onCancel && (
            <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  required: {
    color: '#FF3B30',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#D1D1D6',
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#D1D1D6',
    minHeight: 80,
  },
  hint: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 6,
  },
  feeInfo: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  feeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  feeLabel: {
    fontSize: 15,
    color: '#3C3C43',
  },
  feeValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#3C3C43',
  },
  feeTotal: {
    borderTopWidth: 1,
    borderTopColor: '#D1D1D6',
    marginTop: 8,
    paddingTop: 12,
  },
  feeTotalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  feeTotalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#007AFF',
  },
  actions: {
    gap: 12,
  },
  submitButton: {
    width: '100%',
  },
  cancelButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
});
