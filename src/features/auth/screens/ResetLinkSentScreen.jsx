/**
 * Insightify — Reset Link Sent Screen (Screen 8)
 *
 * Implements the approved Reset Link Sent UI reference:
 * Responsive 3D paper plane illustration with zero fade lag,
 * dynamic email highlight, spam folder callout card, and "Back to Login →" CTA.
 *
 * docs/RFC/RFC-001-F-authentication-and-onboarding.md section 5
 */

import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useResponsive } from '../../../shared/utils/responsive';
import ScreenContainer from '../../../shared/components/ScreenContainer';
import ScreenHeader from '../../../shared/components/ScreenHeader';
import Button from '../../../shared/components/Button';
import Card from '../../../shared/components/Card';

const HERO_IMAGE = require('../../../../assets/auth/reset-link-sent.png');

export default function ResetLinkSentScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { colors, typography } = useTheme();
  const { width, scaleFont } = useResponsive();

  const userEmail = route.params?.email || 'example@email.com';
  const heroSize = Math.min(Math.round(width * 0.52), 210);

  return (
    <ScreenContainer
      scrollable={true}
      withPadding={true}
      contentContainerStyle={styles.scrollContent}
      style={styles.container}
    >
      {/* Back Navigation */}
      <ScreenHeader onBack={() => navigation.navigate('Login')} />

      {/* Responsive Hero Illustration */}
      <View style={[styles.imageContainer, { height: heroSize }]}>
        <Image
          source={HERO_IMAGE}
          style={{ width: heroSize, height: heroSize }}
          resizeMode="contain"
          fadeDuration={0}
        />
      </View>

      {/* Heading & Subtitle */}
      <View style={styles.header}>
        <Text style={[typography.h2, styles.title, { color: colors.textPrimary, fontSize: scaleFont(22, 0.3) }]}>
          Check your email!
        </Text>
        <Text
          style={[
            typography.body,
            styles.subtitle,
            { color: colors.textSecondary, fontSize: scaleFont(14, 0.3) },
          ]}
        >
          We've sent a password reset link to{' '}
          <Text style={[styles.emailHighlight, { color: colors.primary }]}>{userEmail}</Text>
        </Text>
      </View>

      {/* Spam / Resend Callout Card */}
      <Card elevated={false} style={[styles.calloutCard, { backgroundColor: colors.surfaceSecondary }]}>
        <View style={styles.calloutRow}>
          <Ionicons
            name="information-circle-outline"
            size={22}
            color={colors.primary}
            style={styles.calloutIcon}
          />
          <Text style={[typography.bodySmall, styles.calloutText, { color: colors.textSecondary }]}>
            Didn't receive the email? Check your spam folder or request a new link.
          </Text>
        </View>
      </Card>

      {/* Primary Action */}
      <View style={styles.actionArea}>
        <Button
          title="Back to Login →"
          onPress={() => navigation.navigate('Login')}
          style={styles.button}
        />

        {/* Demo transition link */}
        <TouchableOpacity
          onPress={() => navigation.navigate('ResetPassword')}
          style={styles.testLink}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={[typography.caption, { color: colors.textTertiary }]}>
            (Simulate Email Link Click → Create New Password)
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 28,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '700',
  },
  subtitle: {
    textAlign: 'center',
    maxWidth: 290,
    lineHeight: 21,
  },
  emailHighlight: {
    fontWeight: '600',
  },
  calloutCard: {
    padding: 14,
    marginBottom: 24,
    borderWidth: 0,
  },
  calloutRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  calloutIcon: {
    marginRight: 10,
    marginTop: 1,
  },
  calloutText: {
    flex: 1,
    lineHeight: 19,
  },
  actionArea: {
    width: '100%',
  },
  button: {
    width: '100%',
  },
  testLink: {
    alignItems: 'center',
    marginTop: 14,
  },
});
