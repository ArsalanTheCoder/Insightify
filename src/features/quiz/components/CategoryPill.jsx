/**
 * Insightify — CategoryPill (Quiz Component)
 *
 * Grid card item for quiz categories on Dashboard.
 *
 * AGENTS.md & docs/RULES.md & RFC-005-F
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useResponsive } from '../../../shared/utils/responsive';

export default function CategoryPill({
  category,
  onPress,
}) {
  const { colors, typography, radii } = useTheme();
  const { scaleFont } = useResponsive();

  const iconBg = colors.surfaceSecondary;
  const iconColor = colors[category.colorKey] || colors.primary;

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={() => onPress?.(category)}
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: radii.large,
        },
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: iconBg, borderRadius: 10 }]}>
        <Ionicons name={category.icon || 'shield'} size={20} color={iconColor} />
      </View>
      <View style={styles.textWrap}>
        <Text
          numberOfLines={1}
          style={[
            typography.h3,
            styles.name,
            { color: colors.textPrimary, fontSize: scaleFont(13.5, 0.3) },
          ]}
        >
          {category.name}
        </Text>
        <Text
          style={[
            typography.caption,
            styles.count,
            { color: colors.textSecondary, fontSize: scaleFont(11.5, 0.3) },
          ]}
        >
          {category.count} Quizzes
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
  },
  iconWrap: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  textWrap: {
    flex: 1,
  },
  name: {
    fontWeight: '700',
    marginBottom: 2,
  },
  count: {
    fontWeight: '500',
  },
});
