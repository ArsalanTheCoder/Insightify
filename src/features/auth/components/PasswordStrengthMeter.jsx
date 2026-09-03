/**
 * Insightify — PasswordStrengthMeter (Component)
 *
 * 3-segment progress indicator dynamically updating strength score & color label.
 *
 * docs/RFC/RFC-001-F-authentication-and-onboarding.md section 7
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../shared/hooks/useTheme';

export function calculatePasswordStrength(password = '') {
  if (!password) {
    return { score: 0, label: '', color: 'transparent' };
  }

  let score = 0;
  const length = password.length;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);

  if (length >= 8 && hasLetter && hasNumber && hasSpecial && length >= 10) {
    score = 3;
  } else if (length >= 8 && hasLetter && hasNumber) {
    score = 2;
  } else if (length > 0) {
    score = 1;
  }

  switch (score) {
    case 3:
      return { score: 3, label: 'Strong', color: '#20B86B' };
    case 2:
      return { score: 2, label: 'Fair', color: '#F59E0B' };
    case 1:
      return { score: 1, label: 'Weak', color: '#EF4444' };
    default:
      return { score: 0, label: '', color: 'transparent' };
  }
}

export default function PasswordStrengthMeter({ password = '', style }) {
  const { colors, typography, radii } = useTheme();
  const { score, label, color } = calculatePasswordStrength(password);

  if (!password) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      {/* 3-segment progress bar */}
      <View style={styles.barContainer}>
        {[1, 2, 3].map((step) => {
          const isFilled = step <= score;
          return (
            <View
              key={step}
              style={[
                styles.segment,
                {
                  backgroundColor: isFilled ? color : colors.surfaceSecondary,
                  borderRadius: radii.pill,
                },
              ]}
            />
          );
        })}
      </View>

      {/* Strength Label */}
      {label ? (
        <Text style={[typography.caption, styles.label, { color }]}>
          {label}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 4,
    gap: 6,
  },
  segment: {
    flex: 1,
    height: '100%',
  },
  label: {
    marginTop: 4,
    fontWeight: '600',
  },
});
