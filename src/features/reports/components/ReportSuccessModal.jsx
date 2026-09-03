/**
 * Insightify — ReportSuccessModal (Reports Component)
 *
 * Polished centered success dialog after report submission.
 * - Dimmed background overlay
 * - Shield-check illustration (Ionicons)
 * - "Report Submitted" title
 * - Thank-you message
 * - "Done" action button
 * - Responsive, Safe Area aware
 *
 * AGENTS.md & docs/RULES.md
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useResponsive } from '../../../shared/utils/responsive';

export default function ReportSuccessModal({ visible, onDone }) {
  const { colors, typography, radii, isDark } = useTheme();
  const { scaleFont, moderateScale } = useResponsive();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}
      onRequestClose={onDone}
    >
      {/* Dimmed backdrop */}
      <View style={styles.overlay}>
        {/* Centered card */}
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
          {/* Shield illustration */}
          <View
            style={[
              styles.iconCircle,
              {
                backgroundColor: isDark ? '#0E2A1A' : '#DCFCE7',
                borderRadius: moderateScale(50),
              },
            ]}
          >
            <View
              style={[
                styles.innerIconCircle,
                {
                  backgroundColor: isDark ? '#14532D' : '#BBF7D0',
                  borderRadius: moderateScale(36),
                },
              ]}
            >
              <Ionicons name="shield-checkmark" size={36} color="#16A34A" />
            </View>
          </View>

          {/* Title */}
          <Text
            style={[
              typography.h1,
              styles.title,
              { color: colors.textPrimary, fontSize: scaleFont(20, 0.3) },
            ]}
          >
            Report Submitted
          </Text>

          {/* Body message */}
          <Text
            style={[
              typography.body,
              styles.body,
              { color: colors.textSecondary, fontSize: scaleFont(14, 0.3) },
            ]}
          >
            Thank you for helping keep the{'\n'}Insightify community safe.
          </Text>

          {/* Subtle separator */}
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />

          {/* Done button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onDone}
            style={[
              styles.doneBtn,
              {
                backgroundColor: '#4F46E5',
                borderRadius: radii.large,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Done"
          >
            <Text style={[styles.doneBtnText, { fontSize: scaleFont(15, 0.3) }]}>
              Done
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  card: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderWidth: 1,
    elevation: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
  },
  iconCircle: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  innerIconCircle: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  body: {
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '400',
    marginBottom: 20,
  },
  divider: {
    width: '100%',
    height: 1,
    marginBottom: 18,
  },
  doneBtn: {
    width: '100%',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});
