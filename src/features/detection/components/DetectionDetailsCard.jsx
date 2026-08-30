/**
 * Insightify — DetectionDetailsCard (Component)
 *
 * 4-row attribute card on Scan Result screen:
 * Type | Risk Level | Confidence % | Scanned At timestamp.
 *
 * docs/RFC/RFC-004-F-detection-and-scan-history.md section 7
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useResponsive } from '../../../shared/utils/responsive';

export default function DetectionDetailsCard({ result, style }) {
  const { colors, typography, radii } = useTheme();
  const { scaleFont } = useResponsive();

  const isHighRisk = result.riskLevel === 'HIGH';
  const isMediumRisk = result.riskLevel === 'MEDIUM';

  const riskColor = isHighRisk
    ? '#EF4444'
    : isMediumRisk
    ? '#F59E0B'
    : '#10B981';

  const riskLabel = isHighRisk ? 'High' : isMediumRisk ? 'Medium' : 'Low';

  const rows = [
    { label: 'Type', value: result.displayType || result.type, isHighlighted: false },
    { label: 'Risk Level', value: riskLabel, isHighlighted: true, color: riskColor },
    { label: 'Confidence', value: `${result.confidence || 92}%`, isHighlighted: false },
    { label: 'Scanned At', value: result.scannedAt || 'Just now', isHighlighted: false },
  ];

  return (
    <View style={[styles.container, style]}>
      <Text style={[typography.h3, styles.sectionTitle, { color: colors.textPrimary, fontSize: scaleFont(16, 0.3) }]}>
        Detection Details
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
        {rows.map((row, index) => (
          <View
            key={row.label}
            style={[
              styles.row,
              index < rows.length - 1 && { borderBottomColor: colors.divider, borderBottomWidth: 1 },
            ]}
          >
            <Text style={[typography.body, styles.rowLabel, { color: colors.textSecondary }]}>
              {row.label}
            </Text>
            <Text
              style={[
                typography.body,
                styles.rowValue,
                {
                  color: row.color || colors.textPrimary,
                  fontWeight: row.isHighlighted ? '800' : '600',
                },
              ]}
            >
              {row.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  rowLabel: {
    fontWeight: '500',
  },
  rowValue: {
    textAlign: 'right',
  },
});
