/**
 * Insightify — ResultScreen (Reusable Unified Feature Screen)
 *
 * Implements the approved Scan Result screen matching RFC-004-F:
 * Single, unified reusable screen dynamically adapting for:
 * - High Risk (Threat Detected! / Red Palette / "Report This Threat" + "Scan Another")
 * - Medium Risk (Suspicious Content / Amber Palette / "Report This Threat" + "Scan Another")
 * - Low Risk / Safe (Looks Safe / Green-Teal Palette / "Scan Another")
 *
 * docs/RFC/RFC-004-F-detection-and-scan-history.md section 7
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Share,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useResponsive } from '../../../shared/utils/responsive';
import { useScanResult } from '../hooks/useScanResult';
import ScreenContainer from '../../../shared/components/ScreenContainer';
import Button from '../../../shared/components/Button';
import ResultHeader from '../components/ResultHeader';
import ResultHeroBanner from '../components/ResultHeroBanner';
import DetectionDetailsCard from '../components/DetectionDetailsCard';
import ResultReasonsList from '../components/ResultReasonsList';

export default function ResultScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { colors, typography, radii } = useTheme();
  const insets = useSafeAreaInsets();
  const { scaleFont } = useResponsive();

  const routeResult = route.params?.resultData;
  const resultId = route.params?.resultId || routeResult?.id;

  const {
    result: fetchedResult,
    isLoading,
    toggleBookmark,
  } = useScanResult(resultId, routeResult);

  // Fallback to route-passed data during initial mount
  const result = fetchedResult || routeResult;

  const isHighRisk = result?.riskLevel === 'HIGH';
  const isMediumRisk = result?.riskLevel === 'MEDIUM';

  const handleShare = async () => {
    if (!result) {
      return;
    }
    try {
      await Share.share({
        title: `Insightify Scan Result: ${result.heroTitle}`,
        message: `🛡️ Scam Analysis Result: ${result.heroTitle}\nType: ${result.displayType}\nConfidence: ${result.confidence}%\n\nDetails: ${result.heroSubtitle}\n\nStay protected with Insightify.`,
      });
    } catch (error) {
      // User dismissed share dialog
    }
  };

  const handleReportThreat = () => {
    navigation.navigate('ReportScreen', {
      threatTitle: result?.title || result?.heroTitle || 'Unknown Threat',
      threatType: result?.displayType || 'Threat',
      threatUrl: result?.url || null,
      source: 'ScanResult',
    });
  };

  const handleScanAnother = () => {
    navigation.navigate('DetectMain');
  };

  if (isLoading && !result) {
    return (
      <ScreenContainer withPadding={true} style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 12 }]}>
          Loading scan result...
        </Text>
      </ScreenContainer>
    );
  }

  if (!result) {
    return (
      <ScreenContainer withPadding={true} style={styles.centerContainer}>
        <ResultHeader onBack={() => navigation.goBack()} />
        <Text style={[typography.h2, { color: colors.textPrimary, textAlign: 'center', marginTop: 40 }]}>
          Scan Result Not Found
        </Text>
        <Text style={[typography.body, { color: colors.textSecondary, textAlign: 'center', marginTop: 8 }]}>
          The requested scan telemetry is unavailable.
        </Text>
      </ScreenContainer>
    );
  }

  // Safe bottom scroll padding so all action buttons sit above the floating tab bar
  const bottomScrollPadding = (insets.bottom || 8) + 125;

  return (
    <ScreenContainer
      scrollable={true}
      withPadding={true}
      contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomScrollPadding }]}
      style={styles.container}
    >
      {/* 1. Header (Back, Title, Bookmark, Share) */}
      <ResultHeader
        onBack={() => navigation.goBack()}
        isBookmarked={result.isBookmarked}
        onBookmarkToggle={toggleBookmark}
        onShare={handleShare}
      />

      {/* 2. Dynamic Hero Banner with 3D Shield & Spectrum Gauge */}
      <ResultHeroBanner result={result} />

      {/* 3. Detection Details Card */}
      <DetectionDetailsCard result={result} />

      {/* 4. Dynamic Reasons Checklist ("Why it's risky" / "Why it looks safe") */}
      <ResultReasonsList result={result} />

      {/* 5. Dynamic Action Buttons */}
      <View style={styles.actionsContainer}>
        {/* High Risk / Medium Risk: "Report This Threat" + "Scan Another" */}
        {isHighRisk || isMediumRisk ? (
          <>
            <Button
              title="Report This Threat"
              onPress={handleReportThreat}
              style={styles.reportBtn}
            />

            <TouchableOpacity
              onPress={handleScanAnother}
              activeOpacity={0.75}
              style={[
                styles.scanAnotherOutlineBtn,
                {
                  borderColor: colors.border,
                  backgroundColor: colors.surface,
                  borderRadius: radii.large,
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Scan another content"
            >
              <Text style={[typography.button, { color: colors.primary, fontSize: scaleFont(14.5, 0.3) }]}>
                Scan Another
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          /* Safe State: Single "Scan Another" CTA */
          <Button
            title="Scan Another"
            onPress={handleScanAnother}
            style={styles.safeScanBtn}
          />
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 4,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionsContainer: {
    marginTop: 4,
    gap: 12,
  },
  reportBtn: {
    width: '100%',
  },
  scanAnotherOutlineBtn: {
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  safeScanBtn: {
    width: '100%',
  },
});
