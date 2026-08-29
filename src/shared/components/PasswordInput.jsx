/**
 * Insightify — PasswordInput (Shared Component)
 *
 * Extends TextInput with show/hide toggle.
 * Theme-aware: works in Light and Dark modes.
 */

import React, { useState } from 'react';
import {
  View,
  TextInput as RNTextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../hooks/useTheme';

export default function PasswordInput({
  label,
  placeholder = 'Enter password',
  value,
  onChangeText,
  error,
  disabled = false,
  returnKeyType,
  onSubmitEditing,
  style,
  accessibilityLabel,
  ...rest
}) {
  const { colors, typography, spacing, radii } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(true);

  const getBorderColor = () => {
    if (error) {
      return colors.danger;
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
        ]}
      >
        <Ionicons
          name="lock-closed-outline"
          size={20}
          color={isFocused ? colors.primary : colors.textTertiary}
          style={styles.icon}
        />

        <RNTextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          secureTextEntry={isSecure}
          editable={!disabled}
          autoCapitalize="none"
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          accessibilityLabel={accessibilityLabel || label || 'Password'}
          style={[
            typography.body,
            styles.input,
            { color: colors.textPrimary },
          ]}
          {...rest}
        />

        <TouchableOpacity
          onPress={() => setIsSecure(!isSecure)}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityLabel={isSecure ? 'Show password' : 'Hide password'}
          accessibilityRole="button"
        >
          <Ionicons
            name={isSecure ? 'eye-off-outline' : 'eye-outline'}
            size={22}
            color={colors.textTertiary}
          />
        </TouchableOpacity>

        {error && (
          <Ionicons
            name="alert-circle"
            size={20}
            color={colors.danger}
            style={styles.errorIcon}
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
  icon: {
    marginRight: 10,
  },
  errorIcon: {
    marginLeft: 8,
  },
  input: {
    flex: 1,
    padding: 0,
  },
});
