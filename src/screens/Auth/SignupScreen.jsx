import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import auth from '@react-native-firebase/auth';
import CustomInput from '../../components/common/CustomInput';
import PrimaryButton from '../../components/common/PrimaryButton';

export default function SignupScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    // 1. Basic Validation
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      // 2. Create User in Firebase
      const userCredential = await auth().createUserWithEmailAndPassword(email.trim(), password);
      
      // 3. Update Profile with Full Name
      await userCredential.user.updateProfile({
        displayName: fullName
      });

      Alert.alert('Success', 'Account created successfully!');
      // Navigation is usually handled by the listener in App.js when auth state changes
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Error', 'That email address is already in use!');
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('Error', 'That email address is invalid!');
      } else {
        Alert.alert('Error', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.header}>
            <Text style={styles.appName}>Insightify</Text>
            <Text style={styles.tagline}>Join the network of vigilant users.</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subText}>Sign up to start detecting AI fraud today.</Text>

            <CustomInput 
              label="Full Name" 
              placeholder="e.g. Muhammad Maaz"
              value={fullName}
              onChangeText={setFullName}
            />

            <CustomInput 
              label="Email Address" 
              placeholder="name@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />

            <CustomInput 
              label="Password" 
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <CustomInput 
              label="Confirm Password" 
              placeholder="Repeat password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />

            <PrimaryButton 
              title="Sign Up Securely" 
              onPress={handleSignup} 
              isLoading={loading} 
            />

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.linkText}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
          
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { paddingHorizontal: 24, paddingVertical: 40 },
  
  header: { alignItems: 'center', marginBottom: 30 },
  appName: { fontSize: 24, fontWeight: '700', color: '#000' },
  tagline: { fontSize: 13, color: '#666', marginTop: 4 },

  form: { width: '100%' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 8 },
  subText: { fontSize: 15, color: '#666', marginBottom: 30 },

  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  footerText: { color: '#666', fontSize: 15 },
  linkText: { color: '#0056D2', fontWeight: 'bold', fontSize: 15 },
});