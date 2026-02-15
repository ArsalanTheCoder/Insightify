import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// If you have a full logo with text, put it in assets/images/insightify.png
// Otherwise the shield icon is used.
export default function AuthHeader({
  brand = 'Insightify',
  subtitleLine1 = 'Create Your Secure Account',
  subtitleLine2 = 'Join Insightify and stay ahead of AI scams',
}) {
  let logoSource;
  try {
    logoSource = require('../../../assets/images/insightify.png');
  } catch (e) {
    logoSource = null;
  }

  return (
    <View style={styles.header}>
      <View style={styles.row}>
        {logoSource ? (
          <Image source={logoSource} style={styles.logoImage} />
        ) : (
          <View style={styles.logoWrap}>
            <Icon name="shield-outline" size={20} color="#1e293b" />
          </View>
        )}

        <View>
          <Text style={styles.brand}>{brand}</Text>
          <Text style={styles.muted}>AI-Powered Scam Detection</Text>
        </View>
      </View>

      <View style={{ marginTop: 18 }}>
        <Text style={styles.titleLite}>{subtitleLine1}</Text>
        <Text style={styles.subtitle}>{subtitleLine2}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoWrap: {
    width: 44,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e6eefc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#fff',
  },
  logoImage: {
    width: 44,
    height: 44,
    marginRight: 12,
    resizeMode: 'contain',
  },
  brand: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  muted: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  titleLite: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 14,
    color: '#475569',
    marginTop: 6,
  },
});