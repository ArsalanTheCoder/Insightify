/**
 * Insightify — ReportScreen (Reports Feature Screen)
 *
 * Unified Report form screen used from both FeedDetail and ScanResult.
 * Matches approved UI reference:
 *
 * - Back button + "Report Threat" header
 * - Threat context card (title, type, URL/preview)
 * - "Why are you reporting this?" section with 5 radio-style reason rows
 * - Optional additional details textarea (300 char limit + counter)
 * - Optional evidence upload (up to 3 images, native picker)
 * - Anonymous privacy notice
 * - Gradient "Submit Report" CTA
 * - Loading state on submit
 * - Validation (reason required)
 * - ReportSuccessModal on success → Done → goBack()
 *
 * Receives threat context via route.params:
 *   { threatTitle, threatType, threatUrl, threatId, scanId, source }
 *
 * AGENTS.md & docs/RULES.md
 */

import React, { useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useResponsive } from '../../../shared/utils/responsive';
import { REPORT_REASONS } from '../services/reportApi';
import { useReport, MAX_DETAILS_CHARS } from '../hooks/useReport';
import ReportReasonItem from '../components/ReportReasonItem';
import ReportSuccessModal from '../components/ReportSuccessModal';

export default function ReportScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { colors, typography, radii, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { scaleFont } = useResponsive();

  // Threat context passed from FeedDetail or ScanResult
  const {
    threatTitle = 'Unknown Threat',
    threatType = 'Threat',
    threatUrl,
    source = 'Unknown',
  } = route.params || {};

  const {
    selectedReason,
    details,
    evidence,
    isSubmitting,
    submitError,
    isSuccess,
    handleSelectReason,
    handleDetailsChange,
    handleAddEvidence,
    handleRemoveEvidence,
    handleSubmit,
  } = useReport();

  const handlePickEvidence = useCallback(async () => {
    if (evidence.length >= 3) {
      Alert.alert('Maximum Evidence', 'You can attach up to 3 images.');
      return;
    }
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: Math.max(1, 3 - evidence.length),
        quality: 0.7,
      });

      if (!result.didCancel && result.assets) {
        const images = result.assets.map((a) => ({
          uri: a.uri,
          name: a.fileName || `image_${Date.now()}.jpg`,
          type: a.type || 'image/jpeg',
        }));
        handleAddEvidence(images);
      }
    } catch {
      Alert.alert('Error', 'Could not open image picker. Please try again.');
    }
  }, [evidence.length, handleAddEvidence]);

  const handleDone = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onSubmit = useCallback(() => {
    handleSubmit({ threatTitle, threatType, threatUrl, source });
  }, [handleSubmit, threatTitle, threatType, threatUrl, source]);

  const bottomPadding = (insets.bottom || 0) + 24;

  const contextBg = isDark ? '#0D1829' : '#F8FAFC';
  const contextBorderColor = isDark ? '#1E293B' : '#E2E8F0';
  const privacyBg = isDark ? '#0D1829' : '#F8FAFC';
  const privacyBorderColor = isDark ? '#1E293B' : '#E2E8F0';
  const evidenceBorderColor = isDark ? '#334155' : '#CBD5E1';
  const inputBg = isDark ? '#0D1829' : '#F8FAFC';
  const inputBorderColor = isDark ? '#1E293B' : '#E2E8F0';
  const placeholderColor = isDark ? '#475569' : '#94A3B8';

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* ── Header ── */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.background,
            paddingTop: (insets.top || 0) + 8,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          style={[styles.headerBtn, { backgroundColor: isDark ? '#102038' : '#EEF4FF' }]}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={21} color={colors.primary} />
        </TouchableOpacity>

        <Text
          style={[
            typography.h2,
            styles.headerTitle,
            { color: colors.textPrimary, fontSize: scaleFont(18, 0.3) },
          ]}
        >
          Report Threat
        </Text>

        {/* Right spacer */}
        <View style={styles.headerSpacer} />
      </View>

      {/* ── Scrollable form body ── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding + 80 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Threat Context Card */}
        <View
          style={[
            styles.contextCard,
            {
              backgroundColor: contextBg,
              borderColor: contextBorderColor,
              borderRadius: radii.large,
            },
          ]}
        >
          {/* Risk pill */}
          <View style={styles.riskPill}>
            <Ionicons name="warning" size={11} color="#FFFFFF" />
            <Text style={styles.riskPillText}>High Risk</Text>
          </View>

          {/* Title */}
          <Text
            numberOfLines={2}
            style={[
              typography.h2,
              styles.contextTitle,
              { color: colors.textPrimary, fontSize: scaleFont(15, 0.3) },
            ]}
          >
            {threatTitle}
          </Text>

          {/* Type badge + URL row */}
          <View style={styles.contextMeta}>
            <View style={[styles.typePill, { backgroundColor: isDark ? '#1E2D4A' : '#EEF4FF', borderRadius: radii.pill }]}>
              <Text style={[styles.typePillText, { color: isDark ? '#93C5FD' : '#2563EB', fontSize: scaleFont(11, 0.3) }]}>
                {threatType}
              </Text>
            </View>

            {threatUrl ? (
              <Text
                numberOfLines={1}
                style={[
                  typography.caption,
                  styles.contextUrl,
                  { color: colors.textSecondary, fontSize: scaleFont(11.5, 0.3) },
                ]}
              >
                {threatUrl}
              </Text>
            ) : null}

            <Ionicons name="open-outline" size={14} color={isDark ? '#64748B' : '#94A3B8'} />
          </View>
        </View>

        {/* 2. Why are you reporting this? */}
        <Text
          style={[
            typography.h3,
            styles.sectionTitle,
            { color: colors.textPrimary, fontSize: scaleFont(15, 0.3) },
          ]}
        >
          Why are you reporting this?
        </Text>

        {/* Reason rows — grouped card with shared borders */}
        <View style={[styles.reasonsCard, { borderRadius: radii.large }]}>
          {REPORT_REASONS.map((reason, index) => (
            <ReportReasonItem
              key={reason.id}
              reason={reason}
              selected={selectedReason}
              onPress={handleSelectReason}
              isFirst={index === 0}
              isLast={index === REPORT_REASONS.length - 1}
            />
          ))}
        </View>

        {/* Validation error */}
        {submitError ? (
          <View style={[styles.errorRow, { backgroundColor: isDark ? '#2A0D0D' : '#FEF2F2', borderRadius: radii.medium }]}>
            <Ionicons name="alert-circle" size={15} color="#EF4444" />
            <Text style={[styles.errorText, { color: '#EF4444', fontSize: scaleFont(12.5, 0.3) }]}>
              {submitError}
            </Text>
          </View>
        ) : null}

        {/* 3. Additional Details */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionTitleRow}>
            <Text
              style={[
                typography.h3,
                styles.sectionTitle,
                { color: colors.textPrimary, fontSize: scaleFont(15, 0.3), marginBottom: 0 },
              ]}
            >
              Additional Details
            </Text>
            <Text style={[typography.caption, styles.optionalLabel, { color: colors.textTertiary, fontSize: scaleFont(12, 0.3) }]}>
              (Optional)
            </Text>
          </View>

          <TextInput
            value={details}
            onChangeText={handleDetailsChange}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            placeholder="Add any additional information here..."
            placeholderTextColor={placeholderColor}
            style={[
              styles.textArea,
              {
                backgroundColor: inputBg,
                borderColor: inputBorderColor,
                borderRadius: radii.large,
                color: colors.textPrimary,
                fontSize: scaleFont(13.5, 0.3),
              },
            ]}
            accessibilityLabel="Additional details"
          />

          {/* Character counter */}
          <Text
            style={[
              styles.charCounter,
              {
                color: details.length >= MAX_DETAILS_CHARS
                  ? '#EF4444'
                  : colors.textTertiary,
                fontSize: scaleFont(11.5, 0.3),
              },
            ]}
          >
            {details.length}/{MAX_DETAILS_CHARS}
          </Text>
        </View>

        {/* 4. Add Evidence */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionTitleRow}>
            <Text
              style={[
                typography.h3,
                styles.sectionTitle,
                { color: colors.textPrimary, fontSize: scaleFont(15, 0.3), marginBottom: 0 },
              ]}
            >
              Add Evidence
            </Text>
            <Text style={[typography.caption, styles.optionalLabel, { color: colors.textTertiary, fontSize: scaleFont(12, 0.3) }]}>
              (Optional)
            </Text>
          </View>

          <Text style={[typography.caption, styles.evidenceSubtitle, { color: colors.textSecondary, fontSize: scaleFont(12, 0.3) }]}>
            Add screenshots or images that can help us review.
          </Text>

          {/* Selected evidence thumbnails */}
          {evidence.length > 0 && (
            <View style={styles.evidenceThumbnailRow}>
              {evidence.map((img) => (
                <View key={img.uri} style={styles.evidenceThumbnailWrap}>
                  <Image source={{ uri: img.uri }} style={styles.evidenceThumbnail} resizeMode="cover" />
                  <TouchableOpacity
                    style={styles.removeEvidenceBtn}
                    onPress={() => handleRemoveEvidence(img.uri)}
                    accessibilityLabel="Remove image"
                  >
                    <Ionicons name="close-circle" size={18} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Upload button */}
          {evidence.length < 3 && (
            <TouchableOpacity
              onPress={handlePickEvidence}
              activeOpacity={0.75}
              style={[
                styles.uploadBtn,
                {
                  borderColor: evidenceBorderColor,
                  borderRadius: radii.large,
                  backgroundColor: isDark ? '#0D1829' : '#FAFAFA',
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Upload screenshots"
            >
              <Ionicons name="cloud-upload-outline" size={24} color={isDark ? '#4F46E5' : '#4F46E5'} />
              <Text style={[styles.uploadBtnText, { color: '#4F46E5', fontSize: scaleFont(13.5, 0.3) }]}>
                Upload Screenshot(s)
              </Text>
              <Text style={[styles.uploadBtnSub, { color: colors.textTertiary, fontSize: scaleFont(11, 0.3) }]}>
                PNG, JPG up to 5MB
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* 5. Privacy Notice */}
        <View
          style={[
            styles.privacyCard,
            {
              backgroundColor: privacyBg,
              borderColor: privacyBorderColor,
              borderRadius: radii.large,
            },
          ]}
        >
          <View style={[styles.privacyIconWrap, { backgroundColor: isDark ? '#1E293B' : '#EEF4FF', borderRadius: 10 }]}>
            <Ionicons name="lock-closed-outline" size={20} color={isDark ? '#94A3B8' : '#64748B'} />
          </View>
          <View style={styles.privacyTextWrap}>
            <Text style={[typography.h3, styles.privacyTitle, { color: colors.textPrimary, fontSize: scaleFont(13.5, 0.3) }]}>
              Your report is anonymous
            </Text>
            <Text style={[typography.caption, styles.privacyBody, { color: colors.textSecondary, fontSize: scaleFont(12, 0.3) }]}>
              We don't collect your identity.{'\n'}Thank you for helping keep the community safe.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* ── Fixed Bottom Submit Button ── */}
      <View
        style={[
          styles.bottomBar,
          {
            paddingBottom: (insets.bottom || 0) + 12,
            backgroundColor: colors.background,
            borderTopColor: colors.border,
          },
        ]}
      >
        <TouchableOpacity
          onPress={onSubmit}
          activeOpacity={0.85}
          disabled={isSubmitting}
          accessibilityRole="button"
          accessibilityLabel="Submit Report"
          style={styles.submitGradientWrap}
        >
          <LinearGradient
            colors={isSubmitting ? ['#94A3B8', '#64748B'] : ['#3B82F6', '#4F46E5', '#7C3AED']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.submitGradientBtn, { borderRadius: radii.large }]}
          >
            {isSubmitting ? (
              <Text style={[styles.submitBtnText, { fontSize: scaleFont(15, 0.3) }]}>
                Submitting...
              </Text>
            ) : (
              <Text style={[styles.submitBtnText, { fontSize: scaleFont(15, 0.3) }]}>
                Submit Report
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* ── Success Modal ── */}
      <ReportSuccessModal visible={isSuccess} onDone={handleDone} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  headerBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  headerSpacer: {
    width: 38,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  // Threat context card
  contextCard: {
    borderWidth: 1,
    padding: 14,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  riskPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 8,
    gap: 4,
  },
  riskPillText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 11,
  },
  contextTitle: {
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  contextMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  typePill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  typePillText: {
    fontWeight: '700',
  },
  contextUrl: {
    flex: 1,
    fontWeight: '400',
  },

  // Section titles
  sectionTitle: {
    fontWeight: '800',
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  optionalLabel: {
    fontWeight: '400',
  },
  sectionBlock: {
    marginBottom: 20,
  },

  // Reasons card
  reasonsCard: {
    overflow: 'hidden',
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
  },

  // Error
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 10,
    marginBottom: 12,
  },
  errorText: {
    fontWeight: '600',
    flex: 1,
  },

  // Details textarea
  textArea: {
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 40,
    minHeight: 110,
    fontFamily: Platform.OS === 'android' ? 'Roboto' : 'System',
    lineHeight: 20,
  },
  charCounter: {
    textAlign: 'right',
    marginTop: 5,
    fontWeight: '500',
  },

  // Evidence
  evidenceSubtitle: {
    marginBottom: 10,
    fontWeight: '400',
  },
  evidenceThumbnailRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  evidenceThumbnailWrap: {
    position: 'relative',
  },
  evidenceThumbnail: {
    width: 72,
    height: 72,
    borderRadius: 10,
  },
  removeEvidenceBtn: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
  uploadBtn: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  uploadBtnText: {
    fontWeight: '700',
  },
  uploadBtnSub: {
    fontWeight: '400',
  },

  // Privacy
  privacyCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    padding: 14,
    marginBottom: 6,
  },
  privacyIconWrap: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  privacyTextWrap: {
    flex: 1,
  },
  privacyTitle: {
    fontWeight: '800',
    marginBottom: 4,
  },
  privacyBody: {
    lineHeight: 18,
    fontWeight: '400',
  },

  // Bottom bar + submit
  bottomBar: {
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  submitGradientWrap: {
    width: '100%',
    elevation: 3,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  submitGradientBtn: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});
