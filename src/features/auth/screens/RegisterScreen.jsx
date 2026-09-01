/**
 * Insightify — Register Screen (Screen 6)
 *
 * Implements the approved Register UI reference:
 * Rebalanced vertical spacing, enlarged logo header, clean input rhythm,
 * security trust card, and return to login link.
 *
 * docs/RFC/RFC-001-F-authentication-and-onboarding.md section 5
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useResponsive } from '../../../shared/utils/responsive';
import {
  validateRequired,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from '../../../shared/validation/validators';
import ScreenContainer from '../../../shared/components/ScreenContainer';
import ScreenHeader from '../../../shared/components/ScreenHeader';
import Button from '../../../shared/components/Button';
import TextInput from '../../../shared/components/TextInput';
import PasswordInput from '../../../shared/components/PasswordInput';
import AuthHeader from '../components/AuthHeader';
import TrustBadge from '../components/TrustBadge';

export default function RegisterScreen() {
  const navigation = useNavigation();
  const { colors, typography, spacing } = useTheme();
  const { scaleFont } = useResponsive();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const nameError = validateRequired(fullName, 'Full Name');
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const confirmError = validateConfirmPassword(password, confirmPassword);

    if (nameError || emailError || passwordError || confirmError) {
      setErrors({
        fullName: nameError,
        email: emailError,
        password: passwordError,
        confirmPassword: confirmError,
      });
      return;
    }

    setErrors({});
    setLoading(true);

    // Simulated local registration (TBD: real FastAPI contract)
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Account Created',
        'Your Insightify account has been created successfully.',
        [
          {
            text: 'Continue to Login',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
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

      {/* Rebalanced Brand Header with enlarged badge */}
      <AuthHeader
        title="Create your account"
        subtitle="Join Insightify and stay safe online."
        style={styles.authHeader}
      />

      {/* Form Fields */}
      <View style={styles.form}>
        <TextInput
          placeholder="Full Name"
          value={fullName}
          onChangeText={(text) => {
            setFullName(text);
            if (errors.fullName) {
              setErrors((prev) => ({ ...prev, fullName: null }));
            }
          }}
          leftIcon="person-outline"
          autoCapitalize="words"
          error={errors.fullName}
          style={{ marginBottom: spacing.md }}
        />

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (errors.email) {
              setErrors((prev) => ({ ...prev, email: null }));
            }
          }}
          leftIcon="mail-outline"
          keyboardType="email-address"
          error={errors.email}
          style={{ marginBottom: spacing.md }}
        />

        <PasswordInput
          placeholder="Password"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (errors.password) {
              setErrors((prev) => ({ ...prev, password: null }));
            }
          }}
          error={errors.password}
          style={{ marginBottom: spacing.md }}
        />

        <PasswordInput
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            if (errors.confirmPassword) {
              setErrors((prev) => ({ ...prev, confirmPassword: null }));
            }
          }}
          error={errors.confirmPassword}
          style={{ marginBottom: spacing.xs }}
        />

        {/* Trust & Encryption Badge */}
        <TrustBadge style={styles.trustBadge} />

        {/* Primary CTA */}
        <Button
          title="Create Account →"
          onPress={handleRegister}
          loading={loading}
          style={styles.registerButton}
        />
      </View>

      {/* Footer: Return to Login (larger and easily readable) */}
      <View style={styles.footer}>
        <Text
          style={[
            typography.body,
            { color: colors.textSecondary, fontSize: scaleFont(14.5, 0.3) },
          ]}
        >
          Already have an account?{' '}
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityRole="button"
          accessibilityLabel="Go to Login"
        >
          <Text
            style={[
              typography.body,
              styles.loginLink,
              { color: colors.primary, fontSize: scaleFont(14.5, 0.3) },
            ]}
          >
            Login
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
    paddingTop: 8,
    paddingBottom: 28,
  },
  authHeader: {
    marginTop: 4,
    marginBottom: 18,
  },
  form: {
    width: '100%',
  },
  trustBadge: {
    marginTop: 4,
    marginBottom: 16,
  },
  registerButton: {
    width: '100%',
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    paddingBottom: 16,
  },
  loginLink: {
    fontWeight: '700',
  },
});
