/**
 * Insightify — Login Screen (Screen 5)
 *
 * Implements the approved Login UI reference:
 * Rebalanced vertical spacing, enlarged logo header, compact side-by-side social buttons,
 * prominent primary CTA, and comfortable footer spacing.
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
import { useAuthStore } from '../store/authStore';
import { validateEmail, validatePassword } from '../../../shared/validation/validators';
import ScreenContainer from '../../../shared/components/ScreenContainer';
import ScreenHeader from '../../../shared/components/ScreenHeader';
import Button from '../../../shared/components/Button';
import TextInput from '../../../shared/components/TextInput';
import PasswordInput from '../../../shared/components/PasswordInput';
import AuthHeader from '../components/AuthHeader';
import SocialAuthButtons from '../components/SocialAuthButtons';

export default function LoginScreen() {
  const navigation = useNavigation();
  const { colors, typography, spacing } = useTheme();
  const login = useAuthStore((state) => state.login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setErrors({
        email: emailError,
        password: passwordError,
      });
      return;
    }

    setErrors({});
    setLoading(true);

    // Simulated local authentication response (TBD: real FastAPI endpoint)
    setTimeout(() => {
      setLoading(false);
      login({
        id: 'usr_local_01',
        name: 'Insightify User',
        email: email.trim(),
      });
    }, 600);
  };

  const handleSocialAuth = (provider) => {
    Alert.alert(
      `${provider} Sign-In`,
      `${provider} OAuth integration will connect according to the backend contract.`,
      [{ text: 'OK' }]
    );
  };

  return (
    <ScreenContainer
      scrollable={true}
      withPadding={true}
      contentContainerStyle={styles.scrollContent}
      style={styles.container}
    >
      {/* Optional Back Navigation */}
      {navigation.canGoBack() && (
        <ScreenHeader onBack={() => navigation.goBack()} />
      )}

      {/* Rebalanced Brand Header with enlarged badge */}
      <AuthHeader subtitle="Welcome back!" style={styles.authHeader} />

      {/* Form Fields */}
      <View style={styles.form}>
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
          style={{ marginBottom: spacing.xs }}
        />

        {/* Forgot Password Link */}
        <TouchableOpacity
          onPress={() => navigation.navigate('ForgotPassword')}
          style={styles.forgotPassword}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityRole="button"
          accessibilityLabel="Forgot password?"
        >
          <Text style={[typography.caption, styles.forgotPasswordText, { color: colors.primary }]}>
            Forgot password?
          </Text>
        </TouchableOpacity>

        {/* Primary CTA */}
        <Button
          title="Login →"
          onPress={handleLogin}
          loading={loading}
          style={styles.loginButton}
        />

        {/* Compact Side-by-Side Social Authentication */}
        <SocialAuthButtons
          onGooglePress={() => handleSocialAuth('Google')}
          onApplePress={() => handleSocialAuth('Apple')}
        />
      </View>

      {/* Footer: Register Link */}
      <View style={styles.footer}>
        <Text style={[typography.bodySmall, { color: colors.textSecondary }]}>
          Don't have an account?{' '}
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Register')}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityRole="button"
          accessibilityLabel="Go to Register"
        >
          <Text style={[typography.bodySmall, styles.registerLink, { color: colors.primary }]}>
            Register
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
    paddingTop: 16,
    paddingBottom: 28,
    justifyContent: 'center',
    flexGrow: 1,
  },
  authHeader: {
    marginTop: 8,
    marginBottom: 20,
  },
  form: {
    width: '100%',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 22,
    marginTop: 4,
  },
  forgotPasswordText: {
    fontWeight: '500',
  },
  loginButton: {
    width: '100%',
    marginBottom: 6,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
    paddingBottom: 12,
  },
  registerLink: {
    fontWeight: '700',
  },
});
