/**
 * Insightify — FeedDetailScreen (Feature Screen)
 *
 * Implements the approved Threat Detail screen matching the exact visual reference:
 * - Header with Back, Bookmark, Share
 * - Hero section (Severity pill, bold title, location/time/views, right illustration card)
 * - Clean, open layout without excessive boxes/cards:
 *   1. What's happening? (Circular red icon + clean text)
 *   2. Evidence (Circular purple icon + thumbnail cards with "Image X of Y" captions)
 *   3. Example Message (Circular blue icon + clean text with inline link)
 *   4. Safety Tips (Circular green icon + bullet checklist)
 *   5. Report This Threat (Prominent red CTA button)
 *
 * Safe-Area aware: Proper bottom scroll insets ensuring the Report button is 100% visible above the floating bottom tab bar.
 *
 * docs/RFC/RFC-003-F-feed-and-feed-detail.md section 6
 */

import React from 'react';
import {
  Text,
  TouchableOpacity,
  Share,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useResponsive } from '../../../shared/utils/responsive';
import { useThreatDetail } from '../hooks/useThreatDetail';
import ScreenContainer from '../../../shared/components/ScreenContainer';
import DetailHeader from '../components/DetailHeader';
import DetailIncidentHero from '../components/DetailIncidentHero';
import IncidentContextSection from '../components/IncidentContextSection';
import EvidenceGallerySection from '../components/EvidenceGallerySection';
import ExampleMessageSection from '../components/ExampleMessageSection';
import SafetyTipsSection from '../components/SafetyTipsSection';

export default function FeedDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { colors, typography, radii } = useTheme();
  const insets = useSafeAreaInsets();
  const { scaleFont } = useResponsive();

  const routeThreat = route.params?.threat;
  const threatId = route.params?.threatId || routeThreat?.id;

  const {
    threat: fetchedThreat,
    isLoading,
    toggleBookmark,
  } = useThreatDetail(threatId);

  // Fallback to route-passed threat during initial load
  const threat = fetchedThreat || routeThreat;

  const handleShare = async () => {
    if (!threat) {
      return;
    }
    try {
      await Share.share({
        title: `🚨 Scam Alert: ${threat.title}`,
        message: `⚠️ Security Alert: "${threat.title}" is actively circulating in ${threat.location || 'your area'}.\n\nProtect yourself: ${threat.whatIsHappening}\n\nStay protected with Insightify.`,
      });
    } catch (error) {
      // User dismissed share dialog
    }
  };

  const handleReportThreat = () => {
    Alert.alert(
      'Report Threat',
      `Submit evidence or report an active variation of "${threat?.title || 'this threat'}".`,
      [
        {
          text: 'Proceed to Report',
          onPress: () => {
            navigation.navigate('Reports', {
              screen: 'CreateReport',
              params: { prefilledThreatId: threat?.id, threatTitle: threat?.title },
            });
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  if (isLoading && !threat) {
    return (
      <ScreenContainer withPadding={true} style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 12 }]}>
          Loading incident report...
        </Text>
      </ScreenContainer>
    );
  }

  if (!threat) {
    return (
      <ScreenContainer withPadding={true} style={styles.centerContainer}>
        <DetailHeader onBack={() => navigation.goBack()} />
        <Text style={[typography.h2, { color: colors.textPrimary, textAlign: 'center', marginTop: 40 }]}>
          Threat Report Not Found
        </Text>
        <Text style={[typography.body, { color: colors.textSecondary, textAlign: 'center', marginTop: 8 }]}>
          This security alert may have been resolved or archived.
        </Text>
      </ScreenContainer>
    );
  }

  // Safe bottom padding so the Report button and safety tips sit comfortably above the floating tab bar
  const bottomScrollPadding = (insets.bottom || 8) + 125;

  return (
    <ScreenContainer
      scrollable={true}
      withPadding={true}
      contentContainerStyle={[
        styles.scrollContent,
        { paddingBottom: bottomScrollPadding },
      ]}
      style={styles.container}
    >
      {/* Top Action Header (Back, Bookmark, Share) */}
      <DetailHeader
        onBack={() => navigation.goBack()}
        isBookmarked={threat.isBookmarked}
        onBookmarkToggle={toggleBookmark}
        onShare={handleShare}
      />

      {/* Incident Hero (Severity pill, Title, Metadata, Right Illustration Card) */}
      <DetailIncidentHero threat={threat} />

      {/* 1. What's happening? Section */}
      <IncidentContextSection whatIsHappening={threat.whatIsHappening} />

      {/* 2. Evidence Section */}
      <EvidenceGallerySection evidence={threat.evidence} />

      {/* 3. Example Message Section */}
      <ExampleMessageSection exampleContent={threat.exampleContent} />

      {/* 4. Safety Tips Section */}
      <SafetyTipsSection tips={threat.safetyTips} />

      {/* 5. Report This Threat CTA Button (Sits fully above the bottom tab bar) */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handleReportThreat}
        style={[
          styles.reportBtn,
          {
            backgroundColor: '#EF4444',
            borderRadius: radii.large,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Report this threat"
      >
        <Ionicons name="flag" size={18} color="#FFFFFF" style={styles.reportIcon} />
        <Text style={[typography.button, styles.reportBtnText, { fontSize: scaleFont(15, 0.3) }]}>
          Report This Threat
        </Text>
      </TouchableOpacity>
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
  reportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    marginTop: 10,
    elevation: 4,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
  },
  reportIcon: {
    marginRight: 8,
  },
  reportBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
