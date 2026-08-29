/**
 * Insightify — Avatar (Shared Component)
 *
 * Avatar display with image source, initials fallback, or icon fallback.
 *
 * docs/RULES.md section 38
 */

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../hooks/useTheme';

export default function Avatar({
  source,
  name,
  size = 44,
  style,
}) {
  const { colors, typography } = useTheme();

  const getInitials = (str) => {
    if (!str) {
      return '';
    }
    const parts = str.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return str.slice(0, 2).toUpperCase();
  };

  const containerStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: colors.surfaceSecondary,
  };

  if (source) {
    return (
      <Image
        source={typeof source === 'string' ? { uri: source } : source}
        style={[styles.avatar, containerStyle, style]}
        resizeMode="cover"
      />
    );
  }

  if (name) {
    return (
      <View
        style={[
          styles.container,
          containerStyle,
          { backgroundColor: colors.surfaceTertiary },
          style,
        ]}
      >
        <Text
          style={[
            typography.label,
            { color: colors.primary, fontSize: size * 0.36 },
          ]}
        >
          {getInitials(name)}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, containerStyle, style]}>
      <Ionicons name="person" size={size * 0.5} color={colors.textTertiary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatar: {
    overflow: 'hidden',
  },
});
