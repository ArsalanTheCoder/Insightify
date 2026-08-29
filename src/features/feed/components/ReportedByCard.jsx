/**
 * Insightify — ReportedByCard (Component)
 *
 * Community attribution card displaying contributor info and verified status badge.
 *
 * docs/RFC/RFC-003-F-feed-and-feed-detail.md section 6
 */

import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useResponsive } from '../../../shared/utils/responsive';

const LOGO_IMAGE = require('../../../../assets/images/Insightify_logo.png');

export default function ReportedByCard({
  reportedBy,
  style,
}) {
  const { colors, typography, radii, isDark } = useTheme();
  const { scaleFont } = useResponsive();

  const author = reportedBy || {
    name: 'Insightify Community',
    badge: 'Verified',
    role: 'Community contributor',
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={[typography.h3, styles.sectionTitle, { color: colors.textPrimary, fontSize: scaleFont(16, 0.3) }]}>
        Reported By
      </Text>

      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: radii.large,
          },
        ]}
      >
        {/* Left Shield Icon Avatar */}
        <View style={[styles.avatarBox, { backgroundColor: isDark ? '#102038' : '#EEF4FF' }]}>
          <Image
            source={LOGO_IMAGE}
            style={styles.avatarImage}
            resizeMode="contain"
            fadeDuration={0}
          />
        </View>

        {/* Right Contributor Info */}
        <View style={styles.infoCol}>
          <View style={styles.nameRow}>
            <Text style={[typography.h3, styles.authorName, { color: colors.textPrimary, fontSize: scaleFont(14.5, 0.3) }]}>
              {author.name}
            </Text>
            {author.badge ? (
              <View style={[styles.verifiedPill, { backgroundColor: isDark ? '#102038' : '#EEF4FF' }]}>
                <Text style={[styles.verifiedText, { color: colors.primary }]}>
                  {author.badge}
                </Text>
              </View>
            ) : null}
          </View>

          <Text style={[typography.caption, styles.authorRole, { color: colors.textSecondary }]}>
            {author.role}
          </Text>
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
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
  },
  avatarBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarImage: {
    width: 28,
    height: 28,
  },
  infoCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  authorName: {
    fontWeight: '700',
    marginRight: 8,
  },
  verifiedPill: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '700',
  },
  authorRole: {
    fontWeight: '500',
  },
});
