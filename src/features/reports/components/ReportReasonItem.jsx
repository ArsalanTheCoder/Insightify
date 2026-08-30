/**
 * Insightify — ReportReasonItem (Reports Component)
 *
 * A single selectable reason row in the report form.
 * - Left: Icon inside a soft circular background
 * - Center: Label + description
 * - Right: Radio circle (selected = filled indigo with checkmark)
 *
 * AGENTS.md & docs/RULES.md
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useResponsive } from '../../../shared/utils/responsive';

export default function ReportReasonItem({
  reason,
  selected,
  onPress,
  isFirst,
  isLast,
}) {
  const { colors, typography, radii, isDark } = useTheme();
  const { scaleFont } = useResponsive();

  const isSelected = selected === reason.id;

  const containerBorderColor = isSelected
    ? '#4F46E5'
    : colors.border;

  const containerBg = isSelected
    ? isDark ? '#1A1640' : '#F5F3FF'
    : colors.surface;

  const iconBg = isSelected
    ? isDark ? '#2D2770' : '#EDE9FE'
    : isDark ? '#102038' : '#F1F5F9';

  const iconColor = isSelected ? '#4F46E5' : isDark ? '#64748B' : '#94A3B8';

  const borderRadiusStyle = {
    borderTopLeftRadius: isFirst ? radii.large : 0,
    borderTopRightRadius: isFirst ? radii.large : 0,
    borderBottomLeftRadius: isLast ? radii.large : 0,
    borderBottomRightRadius: isLast ? radii.large : 0,
  };

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={() => onPress(reason.id)}
      style={[
        styles.row,
        borderRadiusStyle,
        {
          backgroundColor: containerBg,
          borderColor: containerBorderColor,
          borderBottomWidth: isLast ? 1 : 0,
          borderTopWidth: 1,
          borderLeftWidth: 1,
          borderRightWidth: 1,
        },
      ]}
      accessibilityRole="radio"
      accessibilityState={{ checked: isSelected }}
      accessibilityLabel={`${reason.label}: ${reason.description}`}
    >
      {/* Left: Icon */}
      <View style={[styles.iconWrap, { backgroundColor: iconBg, borderRadius: 10 }]}>
        <Ionicons name={reason.iconName} size={20} color={iconColor} />
      </View>

      {/* Center: Label + description */}
      <View style={styles.textWrap}>
        <Text
          numberOfLines={1}
          style={[
            typography.h3,
            styles.label,
            {
              color: isSelected ? '#4F46E5' : colors.textPrimary,
              fontSize: scaleFont(14, 0.3),
              fontWeight: isSelected ? '800' : '700',
            },
          ]}
        >
          {reason.label}
        </Text>
        <Text
          numberOfLines={2}
          style={[
            typography.caption,
            styles.desc,
            { color: colors.textSecondary, fontSize: scaleFont(12, 0.3) },
          ]}
        >
          {reason.description}
        </Text>
      </View>

      {/* Right: Radio button */}
      <View
        style={[
          styles.radio,
          isSelected
            ? { backgroundColor: '#4F46E5', borderColor: '#4F46E5' }
            : { backgroundColor: 'transparent', borderColor: isDark ? '#334155' : '#CBD5E1' },
        ]}
      >
        {isSelected && <Ionicons name="checkmark" size={13} color="#FFFFFF" />}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  iconWrap: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textWrap: {
    flex: 1,
    paddingRight: 10,
  },
  label: {
    marginBottom: 2,
  },
  desc: {
    lineHeight: 16,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
