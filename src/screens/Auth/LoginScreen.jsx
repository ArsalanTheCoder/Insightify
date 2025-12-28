import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import auth from '@react-native-firebase/auth';
import CustomInput from '../../components/common/CustomInput';
import PrimaryButton from '../../components/common/PrimaryButton';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing Info', 'Please fill in both email and password.');
      return;
    }

    setLoading(true);
    try {
      await auth().signInWithEmailAndPassword(email.trim(), password);
      // The main App.js listener will handle navigation automatically upon auth state change
    } catch (error) {
      let msg = error.message;
      if (error.code === 'auth/invalid-email') msg = 'That email address is invalid.';
      if (error.code === 'auth/user-not-found') msg = 'No account found with this email.';
      if (error.code === 'auth/wrong-password') msg = 'Incorrect password.';
      Alert.alert('Login Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.appName}>Insightify</Text>
          <Text style={styles.tagline}>Empowering You to Outsmart AI Fraud</Text>
        </View>

        {/* Form Section */}
        <View style={styles.form}>
          <Text style={styles.welcomeText}>Welcome Back</Text>
          <Text style={styles.subText}>Login to continue protecting yourself</Text>

          <CustomInput 
            label="Email Address" 
            placeholder="name@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <CustomInput 
            label="Password" 
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.forgotBtn} onPress={() => Alert.alert('Reset Password', 'Forgot Password feature coming soon!')}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <PrimaryButton 
            title="Login Securely" 
            onPress={handleLogin} 
            isLoading={loading} 
          />

          {/* Footer Navigation */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.linkText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Security Badge */}
        <View style={styles.securityFooter}>
           <Text style={styles.securityText}>🔒 Your privacy is protected by end-to-end encryption</Text>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  keyboardView: { flex: 1, paddingHorizontal: 24, justifyContent: 'center' },
  
  header: { alignItems: 'center', marginBottom: 40, marginTop: 20 },
  appName: { fontSize: 28, fontWeight: '700', color: '#000' },
  tagline: { fontSize: 14, color: '#666', marginTop: 5 },

  form: { width: '100%' },
  welcomeText: { fontSize: 26, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 8 },
  subText: { fontSize: 15, color: '#666', marginBottom: 30 },

  forgotBtn: { alignSelf: 'flex-end', marginBottom: 20 },
  forgotText: { color: '#0056D2', fontWeight: '500' },

  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  footerText: { color: '#666', fontSize: 15 },
  linkText: { color: '#0056D2', fontWeight: 'bold', fontSize: 15 },

  securityFooter: { position: 'absolute', bottom: 30, left: 0, right: 0, alignItems: 'center' },
  securityText: { color: '#888', fontSize: 12 },
});