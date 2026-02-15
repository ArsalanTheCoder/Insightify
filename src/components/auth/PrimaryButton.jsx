import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function PrimaryButton({ title, onPress, disabled = false, loading = false }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.btn, disabled && styles.disabled]}
      activeOpacity={0.9}
      disabled={disabled || loading}
    >
      <View style={styles.row}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <>
            <Text style={styles.text}>{title}</Text>
            <Icon name="chevron-forward" size={20} color="#fff" style={{ marginLeft: 8 }} />
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 54,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#2563EB',
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 24,
    elevation: 6,
    paddingHorizontal: 16,
  },
  disabled: {
    opacity: 0.6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
});