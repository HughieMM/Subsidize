import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { colors } from '../theme';

export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
}

export function SearchBar({ value, onChangeText, onSubmit, placeholder = 'Search products...' }: SearchBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.text.tertiary}
          returnKeyType="search"
          onSubmitEditing={onSubmit}
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={() => onChangeText('')} style={styles.clearButton}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
  },
  clearButton: {
    padding: 4,
  },
  clearIcon: {
    fontSize: 18,
    color: colors.text.tertiary,
  },
});
