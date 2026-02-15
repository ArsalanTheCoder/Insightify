import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function QuizResultScreen({ route, navigation }) {
  /* ---------------- REAL DATA FROM QUIZ ---------------- */

  const {
    total = 0,
    correct = 0,
    wrong = 0,
    xpEarned = 0,
  } = route?.params || {};

  // Safety: avoid divide by zero
  const accuracy =
    total > 0 ? Math.round((correct / total) * 100) : 0;

  const isPerfect = correct === total && total > 0;
  const streakBonus = accuracy >= 80; // simple logic (adjust later)

  return (
    <SafeAreaView style={styles.container}>
      {/* 🎉 RESULT CARD */}
      <View style={styles.resultCard}>
        <Text style={styles.resultEmoji}>
          {isPerfect ? '🏆' : '🎉'}
        </Text>

        <Text style={styles.title}>
          {isPerfect ? 'Perfect Score!' : 'Quiz Completed'}
        </Text>

        <Text style={styles.subtitle}>
          {isPerfect
            ? 'Outstanding! You nailed every question 🔥'
            : 'Good effort! Keep improving your scam awareness 🚀'}
        </Text>

        {/* SCORE */}
        <View style={styles.scoreBox}>
          <Text style={styles.scoreText}>
            {correct} / {total}
          </Text>
          <Text style={styles.scoreLabel}>
            Correct Answers
          </Text>
        </View>

        {/* STATS */}
        <View style={styles.statsRow}>
          <Stat label="Accuracy" value={`${accuracy}%`} />
          <Stat label="XP Earned" value={`+${xpEarned}`} />
        </View>

        {/* CORRECT / WRONG */}
        <View style={styles.breakdownRow}>
          <Breakdown label="Correct" value={correct} color="#10B981" />
          <Breakdown label="Wrong" value={wrong} color="#EF4444" />
        </View>
      </View>

      {/* ACTIONS */}
      <TouchableOpacity
        style={styles.primaryBtn}
        onPress={() =>
          navigation.navigate('Rewards', {
            xpEarned,
            correct,
            total,
            streakBonus,
          })
        }
      >
        <Ionicons name="gift" size={18} color="#fff" />
        <Text style={styles.primaryText}>
          View Rewards
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryBtn}
        onPress={() => navigation.navigate('QuizHome')}
      >
        <Text style={styles.secondaryText}>
          Back to Quiz Home
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

/* 🔹 SMALL REUSABLE COMPONENTS */

const Stat = ({ label, value }) => (
  <View style={styles.statBox}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const Breakdown = ({ label, value, color }) => (
  <View style={styles.breakdownBox}>
    <Text style={[styles.breakdownValue, { color }]}>
      {value}
    </Text>
    <Text style={styles.breakdownLabel}>{label}</Text>
  </View>
);

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFF',
    padding: 20,
    justifyContent: 'center',
  },

  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#2563EB',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },

  resultEmoji: {
    fontSize: 44,
    marginBottom: 10,
  },

  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
  },

  subtitle: {
    color: '#64748B',
    marginTop: 6,
    fontSize: 13,
    textAlign: 'center',
  },

  scoreBox: {
    marginTop: 20,
    alignItems: 'center',
  },

  scoreText: {
    fontSize: 36,
    fontWeight: '900',
    color: '#2563EB',
  },

  scoreLabel: {
    fontSize: 12,
    color: '#64748B',
  },

  statsRow: {
    flexDirection: 'row',
    marginTop: 24,
    width: '100%',
    justifyContent: 'space-between',
  },

  statBox: {
    flex: 1,
    backgroundColor: '#EEF4FF',
    marginHorizontal: 6,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },

  statValue: {
    fontWeight: '900',
    color: '#2563EB',
    fontSize: 18,
  },

  statLabel: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 4,
  },

  breakdownRow: {
    flexDirection: 'row',
    marginTop: 18,
    width: '100%',
    justifyContent: 'space-between',
  },

  breakdownBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    marginHorizontal: 6,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },

  breakdownValue: {
    fontSize: 20,
    fontWeight: '900',
  },

  breakdownLabel: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 4,
  },

  primaryBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  primaryText: {
    color: '#fff',
    fontWeight: '800',
    marginLeft: 8,
  },

  secondaryBtn: {
    alignItems: 'center',
    paddingVertical: 12,
  },

  secondaryText: {
    color: '#2563EB',
    fontWeight: '700',
  },
});