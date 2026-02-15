import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

/* ---------------- MOCK DATA ---------------- */

const USER = {
  level: 3,
  xp: 120,
  nextXp: 200,
  streak: 4,
};

const CATEGORIES = [
  {
    id: '1',
    title: 'Phishing & Smishing',
    icon: '🎣',
    xp: 25,
    difficulty: 'Common',
    categoryKey: 'phishing',
  },
  {
    id: '2',
    title: 'AI Voice Scams',
    icon: '🎙️',
    xp: 35,
    difficulty: 'Advanced',
    categoryKey: 'voice',
  },
  {
    id: '3',
    title: 'Deepfake Media',
    icon: '🤖',
    xp: 40,
    difficulty: 'High Risk',
    categoryKey: 'deepfake',
  },
  {
    id: '4',
    title: 'Job & Crypto Scams',
    icon: '💼',
    xp: 30,
    difficulty: 'Frequent',
    categoryKey: 'jobs',
  },
  {
    id: '5',
    title: 'Social Engineering',
    icon: '🧠',
    xp: 45,
    difficulty: 'Psychological',
    categoryKey: 'social',
  },
];

const MINI_GAMES = [
  { id: '1', title: 'Scam or Safe', icon: '🛡️', route: 'QuickScamSafe' },
  { id: '2', title: 'True or False', icon: '❓', route: 'QuickTrueFalse' },
  { id: '3', title: 'Spot the Trick', icon: '🧩', route: 'QuickSpotTrick' },
];

/* ---------------- SCREEN ---------------- */

export default function QuizHomeScreen({ navigation }) {
  const progress = USER.xp / USER.nextXp;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* 🔵 HERO CARD */}
        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <Text style={styles.levelText}>Level {USER.level}</Text>

            <View style={styles.streakBox}>
              <Text style={styles.streakEmoji}>🔥</Text>
              <Text style={styles.streakText}>
                {USER.streak} day streak
              </Text>
            </View>
          </View>

          <Text style={styles.heroTitle}>Scam Awareness Quiz</Text>
          <Text style={styles.heroSub}>
            Learn • Detect • Protect Yourself
          </Text>

          {/* XP BAR */}
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${progress * 100}%` },
              ]}
            />
          </View>

          <Text style={styles.xpText}>
            {USER.xp} / {USER.nextXp} XP
          </Text>

          {/* DEFAULT QUIZ */}
          <TouchableOpacity
            style={styles.playBtn}
            activeOpacity={0.9}
            onPress={() =>
              navigation.navigate('QuizPlay', {
                categoryId: 'phishing', // default / mixed later
                title: 'Daily Scam Quiz',
              })
            }
          >
            <Ionicons name="play" size={18} color="#fff" />
            <Text style={styles.playText}>Play Today’s Quiz</Text>
          </TouchableOpacity>
        </View>

        {/* 🟣 CATEGORIES */}
        <Text style={styles.sectionTitle}>Scam Categories</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={styles.categoryCard}
              activeOpacity={0.85}
              onPress={() =>
                navigation.navigate('QuizPlay', {
                  categoryId: cat.categoryKey,
                  title: cat.title,
                })
              }
            >
              <Text style={styles.catIcon}>{cat.icon}</Text>
              <Text style={styles.catTitle}>{cat.title}</Text>
              <Text style={styles.catMeta}>
                {cat.difficulty} • +{cat.xp} XP
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 🟠 DAILY CHALLENGE */}
        <Text style={styles.sectionTitle}>Daily Challenge</Text>

        <TouchableOpacity
          style={styles.challengeCard}
          activeOpacity={0.85}
          onPress={() =>
            navigation.navigate('QuizPlay', {
              categoryId: 'phishing',
              title: 'Daily Challenge',
            })
          }
        >
          <View>
            <Text style={styles.challengeTitle}>
              🎯 Awareness Boost
            </Text>
            <Text style={styles.challengeSub}>
              Answer 5 scam questions correctly
            </Text>
          </View>
          <Text style={styles.challengeXP}>+50 XP</Text>
        </TouchableOpacity>

        {/* 🟢 MINI GAMES */}
        <Text style={styles.sectionTitle}>Quick Games</Text>

        <View style={styles.gamesRow}>
          {MINI_GAMES.map(game => (
            <TouchableOpacity
              key={game.id}
              style={styles.gameCard}
              activeOpacity={0.85}
              onPress={() =>
              navigation.navigate('QuizPlay', {
                categoryId: 'phishing',
                title: game.title,
                mode: 'quick',
              })
            }
            >
              <Text style={styles.gameIcon}>{game.icon}</Text>
              <Text style={styles.gameTitle}>{game.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------------- STYLES ---------------- */
/* (UNCHANGED – your original styles are perfect) */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFF',
    paddingHorizontal: 16,
  },

  heroCard: {
    backgroundColor: '#2563EB',
    borderRadius: 26,
    padding: 20,
    marginTop: 10,
    marginBottom: 26,
    shadowColor: '#2563EB',
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 8,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  levelText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
  },
  streakBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  streakEmoji: { fontSize: 14, marginRight: 4 },
  streakText: { color: '#fff', fontWeight: '700', fontSize: 12 },

  heroTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 14,
  },
  heroSub: {
    color: '#DBEAFE',
    marginTop: 6,
    fontSize: 13,
  },

  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 8,
    marginTop: 16,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  xpText: {
    color: '#DBEAFE',
    fontSize: 11,
    marginTop: 6,
  },

  playBtn: {
    marginTop: 18,
    backgroundColor: '#1E40AF',
    paddingVertical: 14,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playText: {
    color: '#fff',
    fontWeight: '800',
    marginLeft: 8,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 12,
  },

  categoryCard: {
    backgroundColor: '#FFFFFF',
    width: 158,
    padding: 16,
    borderRadius: 20,
    marginRight: 12,
    shadowColor: '#2563EB',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  catIcon: { fontSize: 28 },
  catTitle: {
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 10,
  },
  catMeta: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 6,
    fontWeight: '600',
  },

  challengeCard: {
    backgroundColor: '#EEF4FF',
    borderRadius: 18,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 26,
  },
  challengeTitle: {
    fontWeight: '800',
    color: '#0F172A',
    fontSize: 16,
  },
  challengeSub: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 4,
  },
  challengeXP: {
    color: '#2563EB',
    fontWeight: '900',
    fontSize: 16,
  },

  gamesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gameCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 18,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  gameIcon: { fontSize: 26 },
  gameTitle: {
    marginTop: 8,
    fontWeight: '700',
    fontSize: 12,
    textAlign: 'center',
    color: '#0F172A',
  },
});