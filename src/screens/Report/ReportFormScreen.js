import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function ReportFormScreen({ navigation }) {
  const [source, setSource] = useState('SMS');
  const [category, setCategory] = useState('Phishing');
  const [severity, setSeverity] = useState('Medium');
  const [message, setMessage] = useState('');

  const canSubmit = message.trim().length > 10;

  const handleSubmit = () => {
    navigation.replace('ReportSuccess', {
      confidence: 82.3,
      source,
      category,
      severity,
      length: message.length,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Icon name="arrow-back" size={22} color="#2563EB" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Report a Scam</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* INTRO */}
      <View style={styles.introCard}>
        <Icon name="shield-checkmark" size={20} color="#2563EB" />
        <Text style={styles.introText}>
          Help us analyze and protect others from this scam.
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* SOURCE */}
        <Section
          title="Scam Source"
          subtitle="Where did you encounter this?"
        >
          {['SMS', 'Call', 'Email', 'WhatsApp', 'Social Media', 'Website'].map(
            (item) => (
              <Chip
                key={item}
                label={item}
                active={source === item}
                onPress={() => setSource(item)}
              />
            ),
          )}
        </Section>

        {/* CATEGORY */}
        <Section
          title="Scam Category"
          subtitle="What best describes this scam?"
        >
          {[
            'Phishing',
            'Job Scam',
            'Crypto Fraud',
            'Loan Scam',
            'Impersonation',
            'Lottery / Prize',
          ].map((item) => (
            <Chip
              key={item}
              label={item}
              active={category === item}
              onPress={() => setCategory(item)}
            />
          ))}
        </Section>

        {/* MESSAGE */}
        <Section
          title="Scam Details"
          subtitle="Paste the message or describe what happened"
        >
          <TextInput
            placeholder="Example: I received a message claiming to be from my bank asking me to verify my account..."
            placeholderTextColor="#94A3B8"
            value={message}
            onChangeText={setMessage}
            multiline
            style={styles.input}
          />
        </Section>

        {/* SEVERITY */}
        <Section
          title="Severity Level"
          subtitle="How dangerous did it feel?"
        >
          {['Low', 'Medium', 'High'].map((item) => (
            <Chip
              key={item}
              label={item}
              active={severity === item}
              onPress={() => setSeverity(item)}
            />
          ))}
        </Section>

        {/* SUBMIT */}
        <TouchableOpacity
          style={[
            styles.submitBtn,
            !canSubmit && { opacity: 0.5 },
          ]}
          disabled={!canSubmit}
          onPress={handleSubmit}
        >
          <Icon name="send" size={18} color="#fff" />
          <Text style={styles.submitText}>Submit Report</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------------- SMALL COMPONENTS ---------------- */

function Section({ title, subtitle, children }) {
  return (
    <View style={styles.section}>
      <Text style={styles.label}>{title}</Text>
      <Text style={styles.subLabel}>{subtitle}</Text>
      <View style={styles.row}>{children}</View>
    </View>
  );
}

function Chip({ label, active, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.chip, active && styles.chipActive]}
    >
      <Text style={active ? styles.chipTextActive : styles.chipText}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFF',
    padding: 16,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },

  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
  },

  introCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF4FF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },

  introText: {
    marginLeft: 10,
    color: '#0F172A',
    fontWeight: '600',
    flex: 1,
  },

  section: {
    marginBottom: 18,
  },

  label: {
    fontWeight: '900',
    color: '#0F172A',
    fontSize: 15,
  },

  subLabel: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 8,
  },

  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  chipActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },

  chipText: {
    fontWeight: '700',
    color: '#0F172A',
    fontSize: 13,
  },

  chipTextActive: {
    fontWeight: '800',
    color: '#FFFFFF',
    fontSize: 13,
  },

  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    minHeight: 120,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  submitBtn: {
    marginTop: 28,
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },

  submitText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 16,
    marginLeft: 8,
  },
});