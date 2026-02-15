import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
  Image,
  Easing,
} from 'react-native';

export default function SplashScreen({ navigation }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.6)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 5,
          tension: 90,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2563EB" />

      {/* MAIN CONTENT */}
      <View style={styles.center}>
        {/* LOGO */}
        <Animated.View
          style={[
            styles.logoWrap,
            { opacity, transform: [{ scale }] },
          ]}
        >
          <Image
            source={require('../../../assets/images/insightify.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>

        {/* NAME + TAGLINE (CLOSER TO LOGO) */}
        <Animated.View
          style={{
            opacity,
            transform: [{ translateY }],
            alignItems: 'center',
            marginTop: -6, // pulls text closer into logo
          }}
        >
          <Text style={styles.appName}>Insightify</Text>
          <Text style={styles.tagline}>
            AI-Powered Scam Detection
          </Text>
        </Animated.View>
      </View>

      {/* FOOTER (SLIGHTLY UP) */}
      <Animated.View
        style={[
          styles.footer,
          { opacity, transform: [{ translateY }] },
        ]}
      >
        <Text style={styles.footerText}>
          Protecting humans from digital deception
        </Text>
      </Animated.View>
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2563EB',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 10, // lifts whole block slightly up
  },

  logoWrap: {
    marginBottom: 0.01, // very small gap after logo
  },

  logo: {
    width: 260,
    height: 260,
  },

  appName: {
    fontSize: 40,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
  },

  tagline: {
    marginTop: 4,
    fontSize: 14,
    color: '#DBEAFE',
    letterSpacing: 0.4,
  },

  footer: {
    position: 'absolute',
    bottom: 48, // lifted up from bottom
    width: '100%',
    alignItems: 'center',
  },

  footerText: {
    fontSize: 12,
    color: '#BFDBFE',
    letterSpacing: 0.3,
  },
});