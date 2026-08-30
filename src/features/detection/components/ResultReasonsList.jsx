/**
 * Insightify — ResultReasonsList (Component)
 *
 * Dynamic checklist on Scan Result screen:
 * "Why it's risky" (🔴 with alert icons) or "Why it looks safe" (🟢 with checkmark icons).
 *
 * docs/RFC/RFC-004-F-detection-and-scan-history.md section 7
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

export default function ResultReasonsList({ result, style }) {
  const { colors, typography, radii } = useTheme();
  const { scaleFont } = useResponsive();

  const isHighRisk = result.riskLevel === 'HIGH';
  const isMediumRisk = result.riskLevel === 'MEDIUM';

  const sectionTitle = isHighRisk
    ? "Why it's risky"
    : isMediumRisk
    ? "Why it's suspicious"
    : 'Why it looks safe';

  const iconColor = isHighRisk
    ? '#EF4444'
    : isMediumRisk
    ? '#F59E0B'
    : '#10B981';

  const iconName = isHighRisk
    ? 'arrow-forward-circle'
    : isMediumRisk
    ? 'alert-circle'
    : 'checkmark-circle';

  const reasons = result.reasons || [
    'No suspicious patterns found',
    'No harmful links detected',
    'No data theft indicators',
    'Safe content',
  ];

  return (
    <View style={[styles.container, style]}>
      {/* Section Title */}
      <Text style={[typography.h3, styles.sectionTitle, { color: colors.textPrimary, fontSize: scaleFont(16, 0.3) }]}>
        {sectionTitle}
      </Text>

      {/* Checklist Card */}
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
        {reasons.map((reason, index) => (
          <View
            key={index}
            style={[
              styles.reasonRow,
              index < reasons.length - 1 && { borderBottomColor: colors.divider, borderBottomWidth: 1 },
            ]}
          >
            <Ionicons
              name={iconName}
              size={18}
              color={iconColor}
              style={styles.reasonIcon}
            />
            <Text
              style={[
                typography.body,
                styles.reasonText,
                { color: colors.textPrimary, fontSize: scaleFont(13.5, 0.3) },
              ]}
            >
              {reason}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: 10,
  },
  card: {
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 4,
    elevation: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
  },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  reasonIcon: {
    marginRight: 12,
  },
  reasonText: {
    flex: 1,
    lineHeight: 19,
    fontWeight: '500',
  },
});
