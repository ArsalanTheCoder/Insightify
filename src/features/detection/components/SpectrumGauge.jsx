/**
 * Insightify — SpectrumGauge (Component)
 *
 * 4-Segment threat risk spectrum gauge bar with pointer indicator.
 * Communicates safety/threat score visually with accessible semantic color steps.
 *
 * docs/RFC/RFC-004-F-detection-and-scan-history.md section 8
 */

import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../shared/hooks/useTheme';

export default function SpectrumGauge({
  riskLevel = 'LOW',
  style,
}) {
  const { isDark } = useTheme();

  const isHighRisk = riskLevel === 'HIGH';
  const isMediumRisk = riskLevel === 'MEDIUM';

  // Pointer color & position
  const pointerColor = isHighRisk
    ? '#EF4444'
    : isMediumRisk
    ? '#F59E0B'
    : '#10B981';

  // Pointer position offset percentage
  const pointerLeftPercent = isHighRisk
    ? '87%'
    : isMediumRisk
    ? '56%'
    : '18%';

  const segments = [
    { id: 'safe', color: '#10B981' },
    { id: 'low_med', color: '#84CC16' },
    { id: 'med', color: '#F59E0B' },
    { id: 'high', color: '#EF4444' },
  ];

  return (
    <View style={[styles.container, style]}>
      {/* 4-Segment Spectrum Bar */}
      <View style={styles.barRow}>
        {segments.map((seg, idx) => {
          const isCurrentZone =
            (isHighRisk && idx === 3) ||
            (isMediumRisk && (idx === 1 || idx === 2)) ||
            (!isHighRisk && !isMediumRisk && idx === 0);

          return (
            <View
              key={seg.id}
              style={[
                styles.segment,
                {
                  backgroundColor: seg.color,
                  opacity: isCurrentZone ? 1 : isDark ? 0.3 : 0.45,
                  marginRight: idx < segments.length - 1 ? 4 : 0,
                },
              ]}
            />
          );
        })}
      </View>

      {/* Pointer Indicator Pin */}
      <View style={[styles.pointerContainer, { left: pointerLeftPercent }]}>
        <View style={[styles.pointerDot, { backgroundColor: pointerColor }]}>
          <Ionicons name="caret-down" size={12} color={pointerColor} style={styles.pointerCaret} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: 12,
    position: 'relative',
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  segment: {
    flex: 1,
    height: '100%',
    borderRadius: 3,
  },
  pointerContainer: {
    position: 'absolute',
    top: 0,
    marginLeft: -6,
    alignItems: 'center',
  },
  pointerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  pointerCaret: {
    position: 'absolute',
    bottom: -8,
  },
});
