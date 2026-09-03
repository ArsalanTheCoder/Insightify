/**
 * Insightify — Forgot Password Screen (Screen 7)
 *
 * Implements the approved Forgot Password UI reference:
 * Responsive 3D envelope illustration with zero fade lag,
 * email input, "Send Reset Link →" CTA, and back to login link.
 *
 * docs/RFC/RFC-001-F-authentication-and-onboarding.md section 5
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useResponsive } from '../../../shared/utils/responsive';
import { validateEmail } from '../../../shared/validation/validators';
import ScreenContainer from '../../../shared/components/ScreenContainer';
import ScreenHeader from '../../../shared/components/ScreenHeader';
import Button from '../../../shared/components/Button';
import TextInput from '../../../shared/components/TextInput';

const HERO_IMAGE = require('../../../../assets/auth/forgot-password.png');

export default function ForgotPasswordScreen() {
  const navigation = useNavigation();
  const { colors, typography, spacing } = useTheme();
  const { width, scaleFont } = useResponsive();

  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const heroSize = Math.min(Math.round(width * 0.52), 210);

  const handleSendResetLink = () => {
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    setError(null);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      navigation.navigate('ResetLinkSent', { email: email.trim() });
    }, 600);
  };

  return (
    <ScreenContainer
      scrollable={true}
      withPadding={true}
      contentContainerStyle={styles.scrollContent}
      style={styles.container}
    >
      {/* Back Navigation */}
      <ScreenHeader onBack={() => navigation.goBack()} />

      {/* Responsive Hero Illustration */}
      <View style={[styles.imageContainer, { height: heroSize }]}>
        <Image
          source={HERO_IMAGE}
          style={{ width: heroSize, height: heroSize }}
          resizeMode="contain"
          fadeDuration={0}
        />
      </View>

      {/* Heading & Instructions */}
      <View style={styles.header}>
        <Text style={[typography.h2, styles.title, { color: colors.textPrimary, fontSize: scaleFont(22, 0.3) }]}>
          Forgot password?
        </Text>
        <Text
          style={[
            typography.body,
            styles.subtitle,
            { color: colors.textSecondary, fontSize: scaleFont(14, 0.3) },
          ]}
        >
          Enter your email and we'll send you a link to reset your password.
        </Text>
      </View>

      {/* Input & Action */}
      <View style={styles.form}>
        <TextInput
          placeholder="Email address"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (error) {
              setError(null);
            }
          }}
          leftIcon="mail-outline"
          keyboardType="email-address"
          error={error}
          style={{ marginBottom: spacing.xl }}
        />

        <Button
          title="Send Reset Link →"
          onPress={handleSendResetLink}
          loading={loading}
          style={styles.submitButton}
        />
      </View>

      {/* Footer Link */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityRole="button"
          accessibilityLabel="Back to login"
        >
          <Text style={[typography.button, styles.backLink, { color: colors.primary }]}>
            Back to login
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
    marginBottom: 24,
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
  form: {
    width: '100%',
  },
  submitButton: {
    width: '100%',
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
    paddingBottom: 16,
  },
  backLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});
