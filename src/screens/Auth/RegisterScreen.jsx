import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import Screen from '../../components/layout/Screen';
import AuthHeader from '../../components/auth/AuthHeader';
import AuthInput from '../../components/auth/AuthInput';
import PrimaryButton from '../../components/auth/PrimaryButton';
import SocialAuthRow from '../../components/auth/SocialAuthRow';
import { registerWithEmail } from '../../services/authService';

export default function RegisterScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [twoStep, setTwoStep] = useState(true);
  const [loading, setLoading] = useState(false);

  const canSubmit =
    fullName.trim().length > 2 &&
    email.trim().length > 5 &&
    password.length >= 6 &&
    password === confirm;

  const handleRegister = async () => {
    if (!canSubmit) {
      Alert.alert('Check details', 'Please fill fields correctly');
      return;
    }

    try {
      setLoading(true);
      await registerWithEmail(email.trim(), password);
      Alert.alert('Success', 'Account created successfully');
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Registration Failed', error?.message || 'Try again');
    } finally {
      setLoading(false);
    }
  };

  return (
     <Screen padded backgroundColor="#FFFFFF">
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header: brand + small intro */}
        <AuthHeader
          brand="Insightify"
          subtitleLine1="Create Your Secure Account"
          subtitleLine2="Join Insightify and stay ahead of AI scams"
        />

        {/* Form */}
        <View style={styles.form}>
          <AuthInput
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
          />
          <AuthInput
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <AuthInput
            placeholder="Password (min 6 chars)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <AuthInput
            placeholder="Confirm Password"
            value={confirm}
            onChangeText={setConfirm}
            secureTextEntry
          />

          {/* 2-step toggle */}
          <View style={styles.switchRow}>
            <Switch
              value={twoStep}
              onValueChange={setTwoStep}
              trackColor={{ false: '#d1d5db', true: '#7fb3ff' }}
              thumbColor={twoStep ? '#1e40af' : '#fff'}
            />
            <Text style={styles.switchText}>
              Enable 2-Step Verification?
              <Text style={styles.recommended}> (Recommended)</Text>
            </Text>
          </View>

          {/* CTA */}
          <PrimaryButton
            title={loading ? 'Creating Account...' : 'Sign Up Securely'}
            onPress={handleRegister}
            disabled={!canSubmit || loading}
            loading={loading}
          />

          {/* <View style={styles.hints}>
            <Icon name="shield-checkmark-outline" size={14} color="#2563EB" />
            <Text style={styles.hintText}>
              {'  '}
              Use a strong, unique password. We protect your data with end-to-end
              encryption.
            </Text>
          </View> */}
        </View>

        {/* Already have account */}
        <View style={styles.bottomRow}>
          <Text style={styles.small}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}> Sign In</Text>
          </TouchableOpacity>
        </View>

        {/* social */}
        <SocialAuthRow
          onGoogle={() => Alert.alert('Google Sign In')}
          onApple={() => Alert.alert('Apple Sign In')}
          onLinkedIn={() => Alert.alert('LinkedIn Sign In')}
        />

        {/* privacy */}
        <View style={styles.privacy}>
          <Icon name="lock-closed-outline" size={14} color="#6b7280" />
          <Text style={styles.privacyText}>
            {'  '}Your privacy is protected by end-to-end encryption
          </Text>
        </View>

        <View style={{ height: 36 }} />
      </ScrollView>
    </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F8FAFF' },
  container: {
    paddingTop: 28,
    paddingBottom: 24,
  },

  form: { marginTop: 6, marginBottom: 8 },

  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  switchText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  recommended: { color: '#2563EB', fontWeight: '700' },

  hints: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  hintText: {
    color: '#475569',
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 18,
  },
  small: { fontSize: 13, color: '#6B7280' },
  link: { fontSize: 13, color: '#2563EB', fontWeight: '700' },

  privacy: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
  },
  privacyText: { fontSize: 12, color: '#6B7280' },
});