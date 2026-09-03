/**
 * Insightify — Reset Password Screen (Screen 9)
 *
 * Implements the approved Reset Password UI reference:
 * "Create new password" heading, new password input with dynamic 3-tier strength meter,
 * confirm new password input, and "Update Password →" CTA.
 *
 * docs/RFC/RFC-001-F-authentication-and-onboarding.md section 5
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../shared/hooks/useTheme';
import {
  validatePassword,
  validateConfirmPassword,
} from '../../../shared/validation/validators';
import ScreenContainer from '../../../shared/components/ScreenContainer';
import ScreenHeader from '../../../shared/components/ScreenHeader';
import Button from '../../../shared/components/Button';
import PasswordInput from '../../../shared/components/PasswordInput';
import PasswordStrengthMeter, {
  calculatePasswordStrength,
} from '../components/PasswordStrengthMeter';

export default function ResetPasswordScreen() {
  const navigation = useNavigation();
  const { colors, typography, spacing } = useTheme();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = () => {
    const passwordError = validatePassword(newPassword);
    const confirmError = validateConfirmPassword(newPassword, confirmPassword);

    const { score } = calculatePasswordStrength(newPassword);
    let strengthError = null;
    if (!passwordError && score < 2) {
      strengthError = 'Please choose a stronger password';
    }

    if (passwordError || confirmError || strengthError) {
      setErrors({
        newPassword: passwordError || strengthError,
        confirmPassword: confirmError,
      });
      return;
    }

    setErrors({});
    setLoading(true);

    // Simulated local password update (TBD: real FastAPI reset endpoint)
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('PasswordUpdated');
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

      {/* Screen Title & Instruction */}
      <View style={styles.header}>
        <Text style={[typography.h2, styles.title, { color: colors.textPrimary }]}>
          Create new password
        </Text>
        <Text style={[typography.body, styles.subtitle, { color: colors.textSecondary }]}>
          Your new password must be different from previous used passwords.
        </Text>
      </View>

      {/* Form Fields */}
      <View style={styles.form}>
        <PasswordInput
          placeholder="New Password"
          value={newPassword}
          onChangeText={(text) => {
            setNewPassword(text);
            if (errors.newPassword) {
              setErrors((prev) => ({ ...prev, newPassword: null }));
            }
          }}
          error={errors.newPassword}
        />

        {/* Dynamic 3-Tier Password Strength Meter */}
        <PasswordStrengthMeter password={newPassword} />

        <PasswordInput
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            if (errors.confirmPassword) {
              setErrors((prev) => ({ ...prev, confirmPassword: null }));
            }
          }}
          error={errors.confirmPassword}
          style={{ marginTop: spacing.md, marginBottom: spacing.xl }}
        />

        {/* Primary Action */}
        <Button
          title="Update Password →"
          onPress={handleUpdatePassword}
          loading={loading}
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
    paddingBottom: 28,
  },
  header: {
    marginTop: 16,
    marginBottom: 32,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    lineHeight: 22,
  },
  form: {
    width: '100%',
  },
  button: {
    width: '100%',
  },
});
