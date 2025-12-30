import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { colors } from '../theme';

export interface ListRowProps {
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
  leftElement?: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
}

export function ListRow({
  title,
  subtitle,
  rightElement,
  leftElement,
  onPress,
  style,
}: ListRowProps) {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {leftElement && <View style={styles.leftElement}>{leftElement}</View>}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        {subtitle && (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>
      {rightElement && <View style={styles.rightElement}>{rightElement}</View>}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  leftElement: {
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  rightElement: {
    marginLeft: 12,
  },
});
