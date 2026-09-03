/**
 * Insightify — ExampleMessageCard (Component)
 *
 * Quotes the raw scam message / text content with highlighted phishing link.
 *
 * docs/RFC/RFC-003-F-feed-and-feed-detail.md section 6
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useResponsive } from '../../../shared/utils/responsive';

export default function ExampleMessageCard({
  exampleContent,
  style,
}) {
  const { colors, typography, radii, isDark } = useTheme();
  const { scaleFont } = useResponsive();

  if (!exampleContent || !exampleContent.body) {
    return null;
  }

  const cardBg = isDark ? '#122743' : '#F1F5FB';
  const cardBorder = isDark ? '#1C3A63' : '#DDE6F2';

  return (
    <View style={[styles.container, style]}>
      <Text style={[typography.h3, styles.sectionTitle, { color: colors.textPrimary, fontSize: scaleFont(16, 0.3) }]}>
        Example Message
      </Text>

      <View
        style={[
          styles.quoteCard,
          {
            backgroundColor: cardBg,
            borderColor: cardBorder,
            borderRadius: radii.large,
          },
        ]}
      >
        {/* Left Quotation Symbol */}
        <Text style={[styles.quoteMark, { color: colors.primary }]}>❝</Text>

        {/* Message Content */}
        <View style={styles.quoteBody}>
          <Text
            style={[
              typography.body,
              styles.messageText,
              { color: colors.textPrimary, fontSize: scaleFont(14, 0.3) },
            ]}
          >
            {exampleContent.body}
          </Text>

          {/* Phishing Link Warning Pill */}
          {exampleContent.link ? (
            <View style={[styles.linkPill, { backgroundColor: isDark ? '#1A1528' : '#EEF4FF' }]}>
              <Text style={[styles.linkLabel, { color: colors.textTertiary }]}>Malicious Target: </Text>
              <Text style={[styles.linkUrl, { color: colors.primary }]}>
                {exampleContent.link}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 22,
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: 10,
  },
  quoteCard: {
    flexDirection: 'row',
    padding: 16,
    borderWidth: 1,
  },
  quoteMark: {
    fontSize: 26,
    lineHeight: 28,
    marginRight: 10,
    fontWeight: '900',
  },
  quoteBody: {
    flex: 1,
  },
  messageText: {
    lineHeight: 22,
    fontStyle: 'italic',
  },
  linkPill: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  linkLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  linkUrl: {
    fontSize: 12,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
