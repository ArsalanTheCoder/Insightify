import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function SocialAuthRow({ onGoogle, onApple, onLinkedIn }) {
  return (
    <View style={styles.container}>
      {/* Divider */}
      <View style={styles.dividerRow}>
        <View style={styles.line} />
        <Text style={styles.orText}>or continue with</Text>
        <View style={styles.line} />
      </View>

      {/* Buttons */}
      <View style={styles.iconsRow}>
        <SocialButton
          label="Google"
          icon="logo-google"
          color="#DB4437"
          onPress={onGoogle}
        />
        <SocialButton
          label="Apple"
          icon="logo-apple"
          color="#111111"
          onPress={onApple}
        />
        <SocialButton
          label="LinkedIn"
          icon="logo-linkedin"
          color="#0A66C2"
          onPress={onLinkedIn}
        />
      </View>
    </View>
  );
}

/* ---------- REUSABLE BUTTON ---------- */

function SocialButton({ label, icon, color, onPress }) {
  return (
    <TouchableOpacity
      style={styles.button}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <Icon name={icon} size={22} color={color} />
      <Text style={[styles.label, { color }]}>{label}</Text>
    </TouchableOpacity>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    marginTop: 18,
  },

  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5EDFF',
  },

  orText: {
    marginHorizontal: 12,
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },

  iconsRow: {
    flexDirection: 'row',
    gap: 10, // ✅ modern spacing (RN 0.71+)
  },

  button: {
    flex: 1, // ✅ KEY FIX (auto fits screen)
    height: 76,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5EDFF',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',

    // soft shadow
    shadowColor: '#2563EB',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 2,
  },

  label: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '700',
  },
});