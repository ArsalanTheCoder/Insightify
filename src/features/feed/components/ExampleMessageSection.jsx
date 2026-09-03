/**
 * Insightify — ExampleMessageSection (Component)
 *
 * Section 3: "Example Message" on Threat Detail screen.
 * Clean, open layout with circular quote icon header and inline text + blue link directly on screen background.
 *
 * docs/RFC/RFC-003-F-feed-and-feed-detail.md section 6
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useResponsive } from '../../../shared/utils/responsive';

export default function ExampleMessageSection({
  exampleContent,
  style,
}) {
  const { colors, typography, isDark } = useTheme();
  const { scaleFont } = useResponsive();

  if (!exampleContent) {
    return null;
  }

  const iconBg = isDark ? '#102038' : '#E0F2FE';
  const prefixText = exampleContent.prefix || exampleContent.body || '';
  const linkText = exampleContent.link;

  return (
    <View style={[styles.container, style]}>
      {/* Header Row: Circle Icon + Section Title */}
      <View style={styles.headerRow}>
        <View style={[styles.circleIcon, { backgroundColor: iconBg }]}>
          <Ionicons name="chatbox-ellipses" size={15} color={colors.primary} />
        </View>
        <Text style={[typography.h3, styles.heading, { color: colors.textPrimary, fontSize: scaleFont(16, 0.3) }]}>
          Example Message
        </Text>
      </View>

      {/* Body: Clean text with inline underlined link */}
      <Text
        style={[
          typography.body,
          styles.messageText,
          { color: isDark ? '#E2E8F0' : '#475569', fontSize: scaleFont(13.5, 0.3) },
        ]}
      >
        {prefixText}
        {linkText ? (
          <Text style={[styles.linkText, { color: colors.primary }]}>
            {linkText}
          </Text>
        ) : null}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  circleIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  heading: {
    fontWeight: '700',
  },
  messageText: {
    lineHeight: 21,
    paddingLeft: 42,
  },
  linkText: {
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
