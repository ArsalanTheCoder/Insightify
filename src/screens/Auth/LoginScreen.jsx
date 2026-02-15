// src/screens/Auth/LoginScreen.js
import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import AuthInput from '../../components/auth/AuthInput';
import PrimaryButton from '../../components/auth/PrimaryButton';
import SocialAuthRow from '../../components/auth/SocialAuthRow';
import Screen from '../../components/layout/Screen';

import { loginWithEmail } from '../../services/authService';
import { AuthContext } from '../../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext); // ✅ RESTORED

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing Info', 'Please enter email and password');
      return;
    }

    try {
      setLoading(true);

      const userCredential = await loginWithEmail(
        email.trim(),
        password
      );

      // ✅ THIS is what actually logs user in
      await login(userCredential.user);

      // ❌ DO NOT navigate manually
      // AuthContext + Navigator will handle it

    } catch (err) {
      Alert.alert('Login Failed', err.message);
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

        {/* BRAND */}
        <View style={styles.brandBlock}>
          <Image
            source={require('../../../assets/images/insightify.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.brand}>Insightify</Text>
          <Text style={styles.tagline}>AI-Powered Scam Detection</Text>
        </View>

        {/* TITLE */}
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>
          Login to continue protecting yourself from scams
        </Text>

        {/* FORM */}
        <View style={styles.form}>
          <AuthInput
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <AuthInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.forgot}
          >
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <PrimaryButton
            title={loading ? 'Logging in…' : 'Login Securely'}
            onPress={handleLogin}
            disabled={loading}
          />

          {loading && (
            <ActivityIndicator
              style={{ marginTop: 14 }}
              size="small"
              color="#2563EB"
            />
          )}
        </View>

        {/* SIGN UP */}
        <View style={styles.bottomRow}>
          <Text style={styles.small}>Don’t have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.link}> Sign Up</Text>
          </TouchableOpacity>
        </View>

        {/* SOCIAL */}
        <SocialAuthRow />

        {/* TRUST */}
        <View style={styles.privacy}>
          <Icon name="lock-closed-outline" size={14} color="#94A3B8" />
          <Text style={styles.privacyText}>
            {' '}End-to-end encrypted • Privacy protected
          </Text>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
    </Screen>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  container: {
    paddingTop: 28,
    paddingBottom: 24,
  },

  /* BRAND */
  brandBlock: {
    alignItems: 'center',
    marginBottom: 34,
  },

  logo: {
    width: 96,
    height: 96,
    marginBottom: 10,
  },

  brand: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.4,
  },

  tagline: {
    marginTop: 4,
    fontSize: 13,
    color: '#64748B',
  },

  /* TEXT */
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 28,
    lineHeight: 20,
  },

  /* FORM */
  form: {
    marginBottom: 18,
  },

  forgot: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },

  forgotText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563EB',
  },

  /* FOOTER */
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 14,
  },

  small: {
    fontSize: 13,
    color: '#64748B',
  },

  link: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2563EB',
  },

  privacy: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },

  privacyText: {
    fontSize: 12,
    color: '#94A3B8',
  },
});