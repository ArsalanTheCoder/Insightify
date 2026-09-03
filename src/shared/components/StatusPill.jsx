/**
 * Insightify — StatusPill (Shared Component)
 *
 * Displays risk/threat levels with icon + text + color.
 * Never communicates state through color alone.
 *
 * docs/RULES.md sections 27.2, 29
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../hooks/useTheme';

const STATUS_CONFIG = {
  safe: {
    icon: 'shield-checkmark',
    label: 'Safe',
    colorKey: 'success',
    bgKey: 'successSoft',
  },
  low: {
    icon: 'information-circle',
    label: 'Low Risk',
    colorKey: 'success',
    bgKey: 'successSoft',
  },
  medium: {
    icon: 'warning',
    label: 'Medium Risk',
    colorKey: 'warning',
    bgKey: 'warningSoft',
  },
  high: {
    icon: 'alert-circle',
    label: 'High Risk',
    colorKey: 'danger',
    bgKey: 'dangerSoft',
  },
  critical: {
    icon: 'skull',
    label: 'Critical',
    colorKey: 'danger',
    bgKey: 'dangerSoft',
  },
};

export default function StatusPill({
  status = 'safe',
  label: customLabel,
  style,
}) {
  const { colors, typography, radii } = useTheme();
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.safe;

  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: colors[config.bgKey],
          borderRadius: radii.pill,
        },
        style,
      ]}
      accessibilityRole="text"
      accessibilityLabel={customLabel || config.label}
    >
      <Ionicons
        name={config.icon}
        size={16}
        color={colors[config.colorKey]}
        style={styles.icon}
      />
      <Text
        style={[
          typography.label,
          { color: colors[config.colorKey] },
        ]}
      >
        {customLabel || config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: 6,
  },
});

StatusPill.statuses = Object.keys(STATUS_CONFIG);
