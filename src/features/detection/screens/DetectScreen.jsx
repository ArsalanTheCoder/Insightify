/**
 * Insightify — DetectScreen (Feature Screen)
 *
 * Implements the approved AI Scam Analyzer Detect screen matching RFC-004-F:
 * - Detect Header with "History" pill button
 * - AI Scam Analyzer hero card with 3D glowing shield asset
 * - 5 Multimodal Quick Scan options (Text, Email, Image, Video, Audio)
 * - Dynamic Content Input card (Text/Email input with 0/5000 counter, and Image/Video/Audio native pickers & preview)
 * - Primary "Analyze Now" CTA button
 *
 * docs/RFC/RFC-004-F-detection-and-scan-history.md section 5
 */

import React, { useEffect } from 'react';
import {
  StyleSheet,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDetection } from '../hooks/useDetection';
import ScreenContainer from '../../../shared/components/ScreenContainer';
import Button from '../../../shared/components/Button';
import DetectHeader from '../components/DetectHeader';
import AnalyzerHeroCard from '../components/AnalyzerHeroCard';
import QuickScanSelector from '../components/QuickScanSelector';
import ScanInputCard from '../components/ScanInputCard';

export default function DetectScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();

  const {
    activeMode,
    setActiveMode,
    inputContent,
    setInputContent,
    attachment,
    handlePickMedia,
    clearAttachment,
    handleAnalyze,
    isAnalyzing,
    validationError,
  } = useDetection();

  // Listen to incoming initialMode (e.g. from Home Quick Actions)
  useEffect(() => {
    if (route.params?.initialMode) {
      setActiveMode(route.params.initialMode);
    }
  }, [route.params?.initialMode, setActiveMode]);

  const handleHistoryPress = () => {
    navigation.navigate('ScanHistory');
  };

  const bottomScrollPadding = (insets.bottom || 8) + 95;

  return (
    <ScreenContainer
      scrollable={true}
      withPadding={true}
      contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomScrollPadding }]}
      style={styles.container}
    >
      {/* 1. Header Row */}
      <DetectHeader onHistoryPress={handleHistoryPress} />

      {/* 2. AI Scam Analyzer Hero Card */}
      <AnalyzerHeroCard />

      {/* 3. 5 Quick Scan Multimodal Options */}
      <QuickScanSelector
        activeMode={activeMode}
        onSelectMode={setActiveMode}
      />

      {/* 4. Enter Content to Analyze Input Card */}
      <ScanInputCard
        activeMode={activeMode}
        value={inputContent}
        onChangeText={setInputContent}
        attachment={attachment}
        onPickMedia={handlePickMedia}
        onRemoveAttachment={clearAttachment}
        error={validationError}
      />

      {/* 5. Primary Analyze Now CTA Button */}
      <Button
        title="Analyze Now"
        icon="shield-checkmark"
        onPress={handleAnalyze}
        loading={isAnalyzing}
        style={styles.analyzeBtn}
      />
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
  analyzeBtn: {
    width: '100%',
    marginTop: 4,
  },
});
