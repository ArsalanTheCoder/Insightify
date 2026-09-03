/**
 * Insightify — AnalyzerHeroCard (Component)
 *
 * Blue gradient hero card on Detect screen:
 * "AI Scam Analyzer", "Paste suspicious text, URLs, or upload media to scan for threats",
 * with the 3D glowing shield illustration (assets/detect/ai-scanner.png).
 *
 * docs/RFC/RFC-004-F-detection-and-scan-history.md section 5
 */

import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useResponsive } from '../../../shared/utils/responsive';

const HERO_IMAGE = require('../../../../assets/detect/ai-scanner.png');

export default function AnalyzerHeroCard({ style }) {
  const { typography, radii, isDark } = useTheme();
  const { scaleFont } = useResponsive();

  const gradientColors = isDark
    ? ['#1D4ED8', '#0F2E5E']
    : ['#2563EB', '#4F8DFF'];

  return (
    <View style={[styles.outerContainer, style]}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.cardGradient, { borderRadius: radii.large }]}
      >
        {/* Left: Text & Badge Column */}
        <View style={styles.textCol}>
          {/* Top Shield Icon Badge */}
          <View style={styles.shieldBadge}>
            <Ionicons name="shield-checkmark" size={14} color="#FFFFFF" />
          </View>

          {/* Title */}
          <Text
            style={[
              typography.h2,
              styles.title,
              { fontSize: scaleFont(19, 0.3) },
            ]}
          >
            AI Scam Analyzer
          </Text>

          {/* Subtitle */}
          <Text
            style={[
              typography.caption,
              styles.subtitle,
              { fontSize: scaleFont(12, 0.3) },
            ]}
          >
            Paste suspicious text, URLs, or upload media to scan for threats
          </Text>
        </View>

        {/* Right: 3D Glowing Shield Asset */}
        <View style={styles.imageWrapper}>
          <Image
            source={HERO_IMAGE}
            style={styles.heroImage}
            resizeMode="contain"
            fadeDuration={0}
          />
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    borderRadius: 20,
    marginBottom: 16,
    elevation: 6,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
  },
  cardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    minHeight: 125,
  },
  textCol: {
    flex: 1.3,
    paddingRight: 8,
  },
  shieldBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  title: {
    color: '#FFFFFF',
    fontWeight: '800',
    marginBottom: 4,
    lineHeight: 23,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.92)',
    lineHeight: 16,
  },
  imageWrapper: {
    width: 86,
    height: 86,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
});
