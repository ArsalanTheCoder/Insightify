import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Screen - responsive safe-area wrapper
 * Props:
 *  - backgroundColor: screen background
 *  - padded: boolean - if true adds responsive horizontal padding (default true)
 *  - edges: safe-area edges to apply (default ['top','bottom'])
 *  - children
 */
export default function Screen({
  children,
  backgroundColor = '#FFFFFF',
  padded = true,
  edges = ['top', 'bottom'],
}) {
  const { width } = useWindowDimensions();

  // responsive horizontal padding (like MediaQuery)
  // small phones -> ~14, larger -> up to 20
  const horizontalPadding = padded
    ? Math.min(20, Math.max(12, Math.round(width * 0.04)))
    : 0;

  return (
    <SafeAreaView edges={edges} style={[styles.safe, { backgroundColor }]}>
      <View style={[styles.inner, { paddingHorizontal: horizontalPadding }]}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  inner: { flex: 1 },
});