/**
 * Insightify — TextInput (Shared Component)
 *
 * States: default, focused, filled, error, disabled, success.
 * Theme-aware: works in Light and Dark modes.
 *
 * docs/RULES.md section 23
 */

import React, { useState } from 'react';
import {
  View,
  TextInput as RNTextInput,
  Text,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../hooks/useTheme';

export default function TextInput({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  success,
  disabled = false,
  leftIcon,
  multiline = false,
  maxLength,
  keyboardType,
  autoCapitalize = 'none',
  returnKeyType,
  onSubmitEditing,
  style,
  inputStyle,
  accessibilityLabel,
  ...rest
}) {
  const { colors, typography, spacing, radii } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const getBorderColor = () => {
    if (error) {
      return colors.danger;
    }
    if (success) {
      return colors.success;
    }
    if (isFocused) {
      return colors.primary;
    }
    return colors.border;
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text
          style={[
            typography.bodySmall,
            { color: colors.textSecondary, marginBottom: spacing.xs },
          ]}
        >
          {label}
        </Text>
      )}

      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: disabled ? colors.surfaceSecondary : colors.surface,
            borderColor: getBorderColor(),
            borderRadius: radii.medium,
          },
          multiline && styles.multiline,
        ]}
      >
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={20}
            color={isFocused ? colors.primary : colors.textTertiary}
            style={styles.icon}
          />
        )}

        <RNTextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          editable={!disabled}
          multiline={multiline}
          maxLength={maxLength}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          accessibilityLabel={accessibilityLabel || label || placeholder}
          style={[
            typography.body,
            styles.input,
            { color: colors.textPrimary },
            multiline && styles.multilineInput,
            inputStyle,
          ]}
          {...rest}
        />

        {error && (
          <Ionicons
            name="alert-circle"
            size={20}
            color={colors.danger}
            style={styles.trailingIcon}
          />
        )}
        {success && !error && (
          <Ionicons
            name="checkmark-circle"
            size={20}
            color={colors.success}
            style={styles.trailingIcon}
          />
        )}
      </View>

      {error && typeof error === 'string' && (
        <Text
          style={[
            typography.caption,
            { color: colors.danger, marginTop: spacing.xxs },
          ]}
        >
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderWidth: 1.5,
    paddingHorizontal: 14,
  },
  multiline: {
    height: undefined,
    minHeight: 100,
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  icon: {
    marginRight: 10,
  },
  trailingIcon: {
    marginLeft: 8,
  },
  input: {
    flex: 1,
    padding: 0,
  },
  multilineInput: {
    textAlignVertical: 'top',
  },
});
