/**
 * Insightify — ScreenContainer (Shared Component)
 *
 * Safe-area aware, theme-backed container for all screens.
 * Supports scrollable and non-scrollable modes, custom status bar styling.
 *
 * docs/RULES.md section 14-15, 18.1
 */

import React from 'react';
import {
  View,
  ScrollView,
  StatusBar,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';

export default function ScreenContainer({
  children,
  scrollable = false,
  withPadding = true,
  edges = ['top', 'left', 'right'],
  keyboardAvoiding = true,
  style,
  contentContainerStyle,
  ...rest
}) {
  const { colors, screenPaddingHorizontal, isDark } = useTheme();

  const containerPadding = withPadding
    ? { paddingHorizontal: screenPaddingHorizontal }
    : undefined;

  const content = scrollable ? (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={[
        styles.scrollContent,
        containerPadding,
        contentContainerStyle,
      ]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      {...rest}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, containerPadding, style]} {...rest}>
      {children}
    </View>
  );

  return (
    <SafeAreaView
      edges={edges}
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
        translucent={false}
      />
      {keyboardAvoiding ? (
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {content}
        </KeyboardAvoidingView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
