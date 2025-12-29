import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, Button } from '@subsidize/ui';

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card>
          <View style={styles.header}>
            <Text style={styles.title}>Profile</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>user@example.com</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.value}>Guest User</Text>
          </View>
        </Card>

        <View style={styles.buttonContainer}>
          <Button
            title="Sign In"
            onPress={() => {
              console.log('Sign in pressed');
            }}
          />
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
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#000000',
  },
  buttonContainer: {
    marginTop: 16,
  },
});
