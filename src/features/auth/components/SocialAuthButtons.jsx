/**
 * Insightify — SocialAuthButtons (Component)
 *
 * Compact side-by-side Google & Apple social buttons matching the reference layout:
 * [ G Google ]  [  Apple ]
 * Responsive across all screen widths.
 *
 * docs/RFC/RFC-001-F-authentication-and-onboarding.md section 5
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useResponsive } from '../../../shared/utils/responsive';

export default function SocialAuthButtons({ onGooglePress, onApplePress, style }) {
  const { colors, typography, radii } = useTheme();
  const { scaleFont, isSmallDevice } = useResponsive();

  return (
    <View style={[styles.container, style]}>
      {/* "or continue with" divider */}
      <View style={styles.dividerRow}>
        <View style={[styles.dividerLine, { backgroundColor: colors.divider }]} />
        <Text style={[typography.caption, styles.dividerText, { color: colors.textTertiary }]}>
          or continue with
        </Text>
        <View style={[styles.dividerLine, { backgroundColor: colors.divider }]} />
      </View>

      {/* Side-by-side buttons row */}
      <View style={[styles.buttonsRow, { gap: isSmallDevice ? 8 : 12 }]}>
        {/* Google Button */}
        <TouchableOpacity
          onPress={onGooglePress}
          activeOpacity={0.7}
          style={[
            styles.socialButton,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: radii.large,
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Continue with Google"
        >
          <Ionicons name="logo-google" size={17} color={colors.textPrimary} style={styles.icon} />
          <Text
            numberOfLines={1}
            style={[
              typography.button,
              styles.buttonText,
              { color: colors.textPrimary, fontSize: scaleFont(13.5, 0.3) },
            ]}
          >
            Google
          </Text>
        </TouchableOpacity>

        {/* Apple Button */}
        <TouchableOpacity
          onPress={onApplePress}
          activeOpacity={0.7}
          style={[
            styles.socialButton,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: radii.large,
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Continue with Apple"
        >
          <Ionicons name="logo-apple" size={19} color={colors.textPrimary} style={styles.icon} />
          <Text
            numberOfLines={1}
            style={[
              typography.button,
              styles.buttonText,
              { color: colors.textPrimary, fontSize: scaleFont(13.5, 0.3) },
            ]}
          >
            Apple
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 10,
  },
  buttonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderWidth: 1,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 6,
  },
  buttonText: {
    fontWeight: '600',
  },
});
