/**
 * Insightify — LogoutConfirmationModal (Profile Component)
 *
 * Polished modal confirmation dialog for Logging Out.
 * Matches attached approved UI specification:
 * - Dimmed backdrop overlay
 * - Shield with checkmark and alert indicator
 * - "Logout" title & "Are you sure you want to logout from Insightify?" subtitle
 * - "Logout" destructive primary button
 * - "Cancel" secondary outline button
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

export default function LogoutConfirmationModal({
  visible = false,
  onConfirm,
  onCancel,
  isLoggingOut = false,
}) {
  const { colors, typography, radii, isDark } = useTheme();
  const { scaleFont, moderateScale } = useResponsive();

  const circleSize = moderateScale(90);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}
      onRequestClose={onCancel}
    >
      {/* Dimmed backdrop */}
      <View style={styles.overlay}>
        {/* Centered dialog card */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: radii.large || 20,
            },
          ]}
        >
          {/* Shield Badge with Alert Indicator */}
          <View
            style={[
              styles.shieldContainer,
              {
                width: circleSize,
                height: circleSize,
                borderRadius: circleSize / 2,
                backgroundColor: isDark ? '#142745' : '#EEF4FF',
              },
            ]}
          >
            <Ionicons
              name="shield-checkmark"
              size={moderateScale(42)}
              color={colors.primary || '#245BFF'}
            />

            {/* Overlapping alert pill badge */}
            <View
              style={[
                styles.alertPill,
                {
                  backgroundColor: colors.danger || '#EF4444',
                  borderColor: colors.surface,
                },
              ]}
            >
              <Ionicons name="alert" size={13} color="#FFFFFF" />
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
            Logout
          </Text>

          {/* Subtitle */}
          <Text
            style={[
              typography.body,
              styles.subtitle,
              { color: colors.textSecondary, fontSize: scaleFont(13.5, 0.3) },
            ]}
          >
            Are you sure you want to logout from Insightify?
          </Text>

          {/* Buttons Group */}
          <View style={styles.btnGroup}>
            {/* Primary Logout Button */}
            <TouchableOpacity
              activeOpacity={0.85}
              disabled={isLoggingOut}
              onPress={onConfirm}
              style={[
                styles.logoutBtn,
                {
                  backgroundColor: colors.danger || '#EF4444',
                  borderRadius: radii.large || 14,
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Confirm Logout"
            >
              <Text
                style={[
                  styles.logoutBtnText,
                  { fontSize: scaleFont(15, 0.3) },
                ]}
              >
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </Text>
            </TouchableOpacity>

            {/* Secondary Cancel Button */}
            <TouchableOpacity
              activeOpacity={0.75}
              disabled={isLoggingOut}
              onPress={onCancel}
              style={[
                styles.cancelBtn,
                {
                  borderColor: colors.border,
                  borderRadius: radii.large || 14,
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Cancel"
            >
              <Text
                style={[
                  styles.cancelBtnText,
                  {
                    color: colors.textPrimary,
                    fontSize: scaleFont(14.5, 0.3),
                  },
                ]}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(7, 26, 73, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    paddingTop: 28,
    paddingBottom: 22,
    paddingHorizontal: 22,
    borderWidth: 1,
    elevation: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
  },
  shieldContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  alertPill: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '500',
    marginBottom: 22,
    paddingHorizontal: 8,
  },
  btnGroup: {
    width: '100%',
    gap: 10,
  },
  logoutBtn: {
    width: '100%',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  logoutBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  cancelBtn: {
    width: '100%',
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  cancelBtnText: {
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});
