/**
 * Insightify — Button (Shared Component)
 *
 * Supports: primary (gradient), secondary, text, destructive variants.
 * States: default, pressed, disabled, loading.
 * Theme-aware: works in Light and Dark modes.
 *
 * docs/RULES.md sections 22.1–22.5
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../hooks/useTheme';

const VARIANTS = {
  primary: 'primary',
  secondary: 'secondary',
  text: 'text',
  destructive: 'destructive',
};

export default function Button({
  title,
  onPress,
  variant = VARIANTS.primary,
  disabled = false,
  loading = false,
  style,
  textStyle,
  accessibilityLabel,
}) {
  const { colors, typography, radii, gradients } = useTheme();
  const isDisabled = disabled || loading;

  const renderContent = () => (
    <View style={styles.contentRow}>
      {loading && (
        <ActivityIndicator
          size="small"
          color={
            variant === VARIANTS.primary || variant === VARIANTS.destructive
              ? colors.textOnBrand
              : colors.primary
          }
          style={styles.loader}
        />
      )}
      <Text
        style={[
          typography.button,
          getTextStyle(variant, colors),
          isDisabled && styles.disabledText,
          textStyle,
        ]}
      >
        {title}
      </Text>
    </View>
  );

  if (variant === VARIANTS.primary) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || title}
        accessibilityState={{ disabled: isDisabled }}
        style={[style]}
      >
        <LinearGradient
          colors={
            isDisabled
              ? [colors.textTertiary, colors.textTertiary]
              : gradients.primaryCta.colors
          }
          start={gradients.primaryCta.start}
          end={gradients.primaryCta.end}
          style={[
            styles.base,
            { borderRadius: radii.large },
            isDisabled && styles.disabledGradient,
          ]}
        >
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityState={{ disabled: isDisabled }}
      style={[
        styles.base,
        getContainerStyle(variant, colors, radii),
        isDisabled && styles.disabledContainer,
        style,
      ]}
    >
      {renderContent()}
    </TouchableOpacity>
  );
}

function getContainerStyle(variant, colors, radii) {
  switch (variant) {
    case VARIANTS.secondary:
      return {
        backgroundColor: colors.surface,
        borderWidth: 1.5,
        borderColor: colors.border,
        borderRadius: radii.large,
      };
    case VARIANTS.destructive:
      return {
        backgroundColor: colors.danger,
        borderRadius: radii.large,
      };
    case VARIANTS.text:
      return {
        backgroundColor: 'transparent',
      };
    default:
      return {};
  }
}

function getTextStyle(variant, colors) {
  switch (variant) {
    case VARIANTS.primary:
      return { color: colors.textOnBrand };
    case VARIANTS.secondary:
      return { color: colors.primary };
    case VARIANTS.destructive:
      return { color: colors.textOnBrand };
    case VARIANTS.text:
      return { color: colors.primary };
    default:
      return { color: colors.textOnBrand };
  }
}

const styles = StyleSheet.create({
  base: {
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    minWidth: 44,
    minHeight: 44,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
    marginRight: 8,
  },
  disabledGradient: {
    opacity: 0.5,
  },
  disabledContainer: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.7,
  },
});

Button.variants = VARIANTS;
