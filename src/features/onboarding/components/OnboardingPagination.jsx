/**
 * Insightify — OnboardingPagination (Component)
 *
 * 3-dot pagination indicator matching the approved UI reference.
 * Active dot is an elongated pill, inactive dots are subtle circles.
 *
 * docs/RFC/RFC-001-F-authentication-and-onboarding.md section 5
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../../shared/hooks/useTheme';

export default function OnboardingPagination({ total = 3, current = 0, style }) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, style]}>
      {Array.from({ length: total }).map((_, index) => {
        const isActive = index === current;
        return (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor: isActive ? colors.primary : colors.border,
                width: isActive ? 24 : 8,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});
