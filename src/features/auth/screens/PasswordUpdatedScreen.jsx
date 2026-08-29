/**
 * Insightify — Password Updated Screen (Screen 10)
 *
 * Implements the approved Password Updated UI reference:
 * Responsive 3D celebration shield illustration with zero fade lag,
 * "Password updated!" title, success message, and "Back to Login →" CTA.
 *
 * docs/RFC/RFC-001-F-authentication-and-onboarding.md section 5
 */

import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useResponsive } from '../../../shared/utils/responsive';
import ScreenContainer from '../../../shared/components/ScreenContainer';
import ScreenHeader from '../../../shared/components/ScreenHeader';
import Button from '../../../shared/components/Button';

const HERO_IMAGE = require('../../../../assets/auth/password-updated.png');

export default function PasswordUpdatedScreen() {
  const navigation = useNavigation();
  const { colors, typography } = useTheme();
  const { width, scaleFont } = useResponsive();

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

      {/* Responsive Hero Celebration Illustration */}
      <View style={[styles.imageContainer, { height: heroSize }]}>
        <Image
          source={HERO_IMAGE}
          style={{ width: heroSize, height: heroSize }}
          resizeMode="contain"
          fadeDuration={0}
        />
      </View>

      {/* Title & Success Copy */}
      <View style={styles.header}>
        <Text style={[typography.h2, styles.title, { color: colors.textPrimary, fontSize: scaleFont(22, 0.3) }]}>
          Password updated!
        </Text>
        <Text
          style={[
            typography.body,
            styles.subtitle,
            { color: colors.textSecondary, fontSize: scaleFont(14, 0.3) },
          ]}
        >
          Your password has been updated successfully.
        </Text>
      </View>

      {/* Primary Action */}
      <View style={styles.actionArea}>
        <Button
          title="Back to Login →"
          onPress={() => navigation.navigate('Login')}
          style={styles.button}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    justifyContent: 'space-between',
    paddingBottom: 28,
    flexGrow: 1,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 36,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '700',
  },
  subtitle: {
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 21,
  },
  actionArea: {
    width: '100%',
  },
  button: {
    width: '100%',
  },
});
