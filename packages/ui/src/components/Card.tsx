import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

export interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: 'none' | 'small' | 'medium' | 'large';
}

export function Card({ children, style, padding = 'medium' }: CardProps) {
  const cardStyles = [styles.card, styles[`${padding}Padding`], style];

  return <View style={cardStyles}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  nonePadding: {
    padding: 0,
  },
  smallPadding: {
    padding: 8,
  },
  mediumPadding: {
    padding: 16,
  },
  largePadding: {
    padding: 24,
  },
});
