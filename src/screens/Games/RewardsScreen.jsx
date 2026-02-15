import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function RewardsScreen({ route, navigation }) {
  /* ---------------- REAL DATA ---------------- */

  const {
    xpEarned = 0,
    correct = 0,
    total = 0,
    streakBonus = false,
  } = route?.params || {};

  const isPerfect = total > 0 && correct === total;

  /* ---------------- DYNAMIC REWARDS ---------------- */

  const rewards = useMemo(() => {
    const list = [];

    if (xpEarned > 0) {
      list.push({
        id: 'xp',
        title: 'XP Earned',
        value: `+${xpEarned} XP`,
        icon: '⚡',
        color: '#2563EB',
      });
    }

    if (correct > 0) {
      list.push({
        id: 'accuracy',
        title: 'Correct Answers',
        value: `${correct} / ${total}`,
        icon: '🎯',
        color: '#0EA5E9',
      });
    }

    if (isPerfect) {
      list.push({
        id: 'perfect',
        title: 'Achievement Unlocked',
        value: 'Perfect Score',
        icon: '🏆',
        color: '#F59E0B',
      });
    }

    if (streakBonus) {
      list.push({
        id: 'streak',
        title: 'Streak Boost',
        value: '+1 Day',
        icon: '🔥',
        color: '#EF4444',
      });
    }

    if (list.length === 0) {
      list.push({
        id: 'practice',
        title: 'Practice Session',
        value: 'Keep learning to earn rewards',
        icon: '📘',
        color: '#64748B',
      });
    }

    return list;
  }, [xpEarned, correct, total, isPerfect, streakBonus]);

  /* ---------------- RENDER ---------------- */

  const renderItem = ({ item }) => (
    <View style={styles.rewardCard}>
      <View
        style={[
          styles.iconWrap,
          { backgroundColor: `${item.color}15` },
        ]}
      >
        <Text style={styles.rewardIcon}>{item.icon}</Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.rewardTitle}>{item.title}</Text>
        <Text style={[styles.rewardValue, { color: item.color }]}>
          {item.value}
        </Text>
      </View>

      <Ionicons
        name="checkmark-circle"
        size={22}
        color={item.color}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 🌟 HERO HEADER */}
      <View style={styles.hero}>
        <Text style={styles.heroEmoji}>
          {isPerfect ? '🏆' : '🎁'}
        </Text>
        <Text style={styles.heroTitle}>
          {isPerfect ? 'Amazing Work!' : 'Rewards Unlocked'}
        </Text>
        <Text style={styles.heroSub}>
          {isPerfect
            ? 'You achieved a perfect score — impressive!'
            : 'Here’s what you earned from this quiz'}
        </Text>
      </View>

      {/* 🎁 REWARD LIST */}
      <FlatList
        data={rewards}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      />

      {/* ACTION */}
      <TouchableOpacity
        style={styles.doneBtn}
        onPress={() => navigation.navigate('QuizHome')}
        activeOpacity={0.9}
      >
        <Ionicons name="home" size={18} color="#fff" />
        <Text style={styles.doneText}>Back to Quiz Home</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFF',
    padding: 20,
  },

  /* HERO */
  hero: {
    alignItems: 'center',
    marginBottom: 24,
  },
  heroEmoji: {
    fontSize: 46,
    marginBottom: 6,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
  },
  heroSub: {
    color: '#64748B',
    fontSize: 13,
    marginTop: 6,
    textAlign: 'center',
  },

  /* CARD */
  rewardCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#2563EB',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },

  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  rewardIcon: {
    fontSize: 24,
  },

  rewardTitle: {
    fontWeight: '800',
    color: '#0F172A',
  },

  rewardValue: {
    fontWeight: '900',
    marginTop: 4,
  },

  /* ACTION */
  doneBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 6,
    flexDirection: 'row',
    justifyContent: 'center',
  },

  doneText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 16,
    marginLeft: 8,
  },
});