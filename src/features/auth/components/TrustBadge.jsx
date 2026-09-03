/**
 * Insightify — TrustBadge (Component)
 *
 * Security assurance badge matching the register screen reference:
 * "Your data is encrypted and always protected."
 *
 * docs/RFC/RFC-001-F-authentication-and-onboarding.md section 5
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../shared/hooks/useTheme';

export default function TrustBadge({
  message = 'Your data is encrypted and always protected.',
  style,
}) {
  const { colors, typography, radii, isDark } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? colors.surfaceSecondary : colors.successSoft,
          borderColor: isDark ? colors.border : '#B8F0D3',
          borderRadius: radii.large,
        },
        style,
      ]}
    >
      <View style={[styles.iconWrapper, { backgroundColor: colors.success }]}>
        <Ionicons name="checkmark" size={14} color="#FFFFFF" />
      </View>
      <Text style={[typography.caption, styles.text, { color: colors.textSecondary }]}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    marginVertical: 12,
  },
  iconWrapper: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  text: {
    flex: 1,
    lineHeight: 16,
  },
});
