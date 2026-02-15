// src/screens/Auth/ForgotPasswordScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Screen from '../../components/layout/Screen';

import AuthInput from '../../components/auth/AuthInput';
import PrimaryButton from '../../components/auth/PrimaryButton';
import { resetPassword } from '../../services/authService';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    try {
      setLoading(true);
      await resetPassword(email.trim());
      Alert.alert(
        'Email Sent',
        'Password reset link has been sent to your email'
      );
      navigation.goBack();
    } catch (err) {
      Alert.alert('Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen padded edges={['top', 'bottom']} backgroundColor="#FFFFFF"> 
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>

        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#2563EB" />
          </TouchableOpacity>
        </View>

        {/* TITLE */}
        <Text style={styles.title}>Forgot Password?</Text>
        <Text style={styles.subtitle}>
          Enter your email and we’ll send you a reset link
        </Text>

        {/* FORM */}
        <AuthInput
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <PrimaryButton
          title={loading ? 'Sending...' : 'Send Reset Link'}
          onPress={handleReset}
          disabled={loading}
        />

        {/* BACK */}
        <TouchableOpacity
          style={styles.backLogin}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={14} color="#2563EB" />
          <Text style={styles.backText}> Back to Login</Text>
        </TouchableOpacity>

        {/* PRIVACY */}
        <View style={styles.privacy}>
          <Icon name="lock-closed-outline" size={14} color="#94A3B8" />
          <Text style={styles.privacyText}>
            {' '}Your data is encrypted and secure
          </Text>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
    </Screen>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  container: {
    paddingTop: 28,
    paddingBottom: 24,
  },

  header: { marginBottom: 30 },

  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 26,
  },

  backLogin: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2563EB',
  },

  privacy: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
  },
  privacyText: {
    fontSize: 12,
    color: '#94A3B8',
  },
});