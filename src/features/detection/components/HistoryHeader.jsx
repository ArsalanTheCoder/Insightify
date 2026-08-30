/**
 * Insightify — HistoryHeader (Component)
 *
 * Top header on Scan History screen:
 * Back button, "Scan History" title, subtitle, and prominent 3D clipboard asset (assets/detect/scan-history.png).
 *
 * docs/RFC/RFC-004-F-detection-and-scan-history.md section 6
 */

import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useResponsive } from '../../../shared/utils/responsive';

const HISTORY_ASSET = require('../../../../assets/detect/scan-history.png');

export default function HistoryHeader({ onBack, style }) {
  const { colors, typography } = useTheme();
  const { scaleFont, isSmallDevice, moderateScale } = useResponsive();

  const assetSize = isSmallDevice ? moderateScale(96) : moderateScale(114);

  return (
    <View style={[styles.container, style]}>
      {/* Left Column: Back Arrow + Title + Subtitle */}
      <View style={styles.leftCol}>
        <TouchableOpacity
          onPress={onBack}
          activeOpacity={0.7}
          style={styles.backBtn}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>

        <Text style={[typography.h1, styles.title, { color: colors.textPrimary, fontSize: scaleFont(25, 0.3) }]}>
          Scan History
        </Text>
        <Text style={[typography.caption, styles.subtitle, { color: colors.textSecondary, fontSize: scaleFont(12.5, 0.3) }]}>
          Review your past scam analysis
        </Text>
      </View>

      {/* Right Column: Prominent 3D Clipboard Asset Graphic */}
      <View style={[styles.imageWrapper, { width: assetSize, height: assetSize }]}>
        <Image
          source={HISTORY_ASSET}
          style={styles.historyImage}
          resizeMode="contain"
          fadeDuration={0}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingTop: 6,
    paddingBottom: 12,
    marginBottom: 16,
  },
  leftCol: {
    flex: 1,
    paddingRight: 6,
    justifyContent: 'flex-end',
  },
  backBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    marginBottom: 8,
  },
  title: {
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  subtitle: {
    marginTop: 3,
  },
  imageWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -8,
  },
  historyImage: {
    width: '100%',
    height: '100%',
  },
});
