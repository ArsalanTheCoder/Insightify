import React from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Text, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';

import OnboardingFooter from '../../components/Onboarding/OnboardingFooter';
import PrimaryButton from '../../components/auth/PrimaryButton';

const { width } = Dimensions.get('window');

export default function Onboarding2({ navigation }) {
  
  const finishOnboarding = async () => {
    await AsyncStorage.setItem('hasSeenOnboarding', 'true');
    navigation.replace('DetectScreen'); 
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.inner}>
        
        {/* --- CUSTOM SLIDE CONTENT --- */}
        <View style={styles.slideContainer}>
          
          <View style={styles.animationBox}>
             {/* SUGGESTED ANIMATION: 'scan_radar.json' or 'security_scan.json'
                Why: Shows active analysis of data rather than just a static brain.
             */}
            <LottieView
              // Make sure to rename your new lottie file to 'scan_radar.json' or update this path
              source={require('../../../assets/animations/ai_brain.json')} 
              autoPlay
              loop
              style={styles.lottie}
              resizeMode="contain"
            />
          </View>

          {/* --- INVESTOR PITCH TEXT --- */}
          {/* OLD: Powered by Gemini 3 */}
          <Text style={styles.title}>Detect the Undetectable</Text> 
          
          {/* OLD: The world’s first Multimodal Scam Detector... */}
          <Text style={styles.subtitle}>
            Our Multimodal AI analyzes audio, video, and text instantly to catch what humans miss.
          </Text>
        </View>

        {/* --- FOOTER & BUTTONS --- */}
        <View>
          <View style={styles.cta}>
            <PrimaryButton
              title="Next"
              onPress={() => navigation.navigate('Onboarding3')}
            />
          </View>

          <OnboardingFooter
            index={1} 
            total={3} 
            onNext={() => navigation.navigate('Onboarding3')}
            onSkip={finishOnboarding}
          />
        </View>

      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  inner: { flex: 1, justifyContent: 'space-between', padding: 22 },
  
  slideContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  animationBox: {
    width: width * 0.85, // Slightly larger for impact
    height: width * 0.85,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: '#EFF6FF', 
    borderRadius: 200, 
  },
  lottie: {
    width: '100%', // Use full space of the box
    height: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 0.5, // Adds a premium feel
  },
  subtitle: {
    fontSize: 16,
    color: '#4B5563', // Slightly darker for better readability
    textAlign: 'center',
    paddingHorizontal: 15,
    lineHeight: 24,
    fontWeight: '500',
  },
  cta: { paddingHorizontal: 6, marginTop: 6 },
});