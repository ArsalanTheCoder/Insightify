import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  StatusBar,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { AVATARS } from '../../utils/avatars';

const { width } = Dimensions.get('window');

/* ─────────────── DATA ─────────────── */

const USER = {
  name: 'Muhammad Maaz',
  rankTitle: 'Cyber Guardian',
  points: 1200,
  level: 4,
  avatar: AVATARS.image1,
  dailyCompleted: 9,
  dailyTotal: 14,
};

const CATEGORIES = [
  {
    id: 'phishing',
    title: 'Phishing & SMS',
    subtitle: 'Spot fake links & SMS traps',
    icon: 'mail-unread',
    color: '#0284C7',
    bgLight: '#F0F9FF',
    borderColor: '#BAE6FD',
    questions: 4,
    xp: 40,
    badge: 'Popular',
  },
  {
    id: 'voice',
    title: 'AI Voice Scams',
    subtitle: 'Detect cloned voice calls',
    icon: 'call',
    color: '#0D9488',
    bgLight: '#F0FDFA',
    borderColor: '#99F6E4',
    questions: 4,
    xp: 40,
    badge: 'Hot',
  },
  {
    id: 'deepfake',
    title: 'Deepfake Media',
    subtitle: 'Identify fake video & photos',
    icon: 'videocam',
    color: '#E11D48',
    bgLight: '#FFF1F2',
    borderColor: '#FECDD3',
    questions: 4,
    xp: 40,
    badge: 'High Risk',
  },
  {
    id: 'jobs',
    title: 'Job & Crypto',
    subtitle: 'Avoid fake offer letters & bots',
    icon: 'briefcase',
    color: '#D97706',
    bgLight: '#FFFBEB',
    borderColor: '#FDE68A',
    questions: 4,
    xp: 40,
    badge: 'Frequent',
  },
  {
    id: 'social',
    title: 'Social Hacking',
    subtitle: 'Stop psychological tricks',
    icon: 'people',
    color: '#7C3AED',
    bgLight: '#F5F3FF',
    borderColor: '#DDD6FE',
    questions: 1,
    xp: 10,
    badge: 'Essential',
  },
];

const FEATURED = [
  {
    id: 'f1',
    title: 'Deepfake CEO Challenge',
    desc: 'Can you tell a real executive video from an AI clone?',
    questions: '4 Questions',
    xp: '+40 XP',
    categoryId: 'deepfake',
    color: '#0056D2',
    icon: 'aperture-outline',
  },
  {
    id: 'f2',
    title: 'Urgent Family Voice Note',
    desc: 'Learn how to verify suspicious emergency audio clips.',
    questions: '4 Questions',
    xp: '+40 XP',
    categoryId: 'voice',
    color: '#0284C7',
    icon: 'mic-outline',
  },
];

/* ─────────────── SCREEN ─────────────── */

export default function QuizHomeScreen({ navigation }) {
  const dailyProgress = USER.dailyCompleted / USER.dailyTotal;

  const handlePlay = (categoryId, title) => {
    navigation.navigate('QuizPlay', { categoryId, title });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ── CLEAN TOP HEADER ── */}
      <View style={styles.header}>
        <View style={styles.userRow}>
          <View style={styles.avatarWrapper}>
            <Image source={USER.avatar} style={styles.avatarImg} />
            <View style={styles.levelBadge}>
              <Text style={styles.levelBadgeText}>L{USER.level}</Text>
            </View>
          </View>
          <View style={styles.userMeta}>
            <Text style={styles.greetText}>Good morning 👋</Text>
            <Text style={styles.userNameText}>{USER.name}</Text>
            <Text style={styles.rankText}>{USER.rankTitle}</Text>
          </View>
        </View>

        {/* XP Badge */}
        <View style={styles.xpPill}>
          <Ionicons name="flash" size={14} color="#D97706" />
          <Text style={styles.xpPillText}>{USER.points} XP</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* ── DAILY CHALLENGE CARD ── */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => handlePlay('phishing', 'Daily Scam Quiz')}
          style={styles.dailyCardWrapper}
        >
          <LinearGradient
            colors={['#0056D2', '#0284C7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.dailyCard}
          >
            <View style={styles.dailyTopRow}>
              <View style={styles.dailyBadge}>
                <Ionicons name="shield-checkmark-sharp" size={12} color="#0056D2" />
                <Text style={styles.dailyBadgeText}>DAILY DRILL</Text>
              </View>
              <Text style={styles.dailyProgressText}>
                {USER.dailyCompleted}/{USER.dailyTotal} Done
              </Text>
            </View>

            <Text style={styles.dailyTitle}>Daily Scam Awareness Drill</Text>
            <Text style={styles.dailySub}>
              Test your knowledge on today's trending phishing methods.
            </Text>

            {/* Progress Bar */}
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${dailyProgress * 100}%` }]} />
            </View>

            <View style={styles.dailyBottomRow}>
              <Text style={styles.dailyReward}>Earn +50 XP today</Text>
              <View style={styles.dailyStartBtn}>
                <Text style={styles.dailyStartBtnText}>Start Drill</Text>
                <Ionicons name="arrow-forward" size={14} color="#0056D2" />
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* ── FEATURED DRILLS ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Drills</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredScroll}
        >
          {FEATURED.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.88}
              style={styles.featuredCard}
              onPress={() => handlePlay(item.categoryId, item.title)}
            >
              <View style={styles.featuredIconBox}>
                <Ionicons name={item.icon} size={22} color={item.color} />
              </View>

              <Text style={styles.featuredCardTitle}>{item.title}</Text>
              <Text style={styles.featuredCardDesc}>{item.desc}</Text>

              <View style={styles.featuredFooter}>
                <View style={styles.featuredMetaPill}>
                  <Text style={styles.featuredMetaText}>{item.questions}</Text>
                </View>
                <View style={styles.featuredXpPill}>
                  <Text style={styles.featuredXpText}>{item.xp}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── QUIZ CATEGORIES ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quiz Categories</Text>
          <Text style={styles.sectionSub}>Select a topic to test your skills</Text>
        </View>

        <View style={styles.categoriesGrid}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              activeOpacity={0.85}
              style={[styles.categoryCard, { backgroundColor: cat.bgLight, borderColor: cat.borderColor }]}
              onPress={() => handlePlay(cat.id, cat.title)}
            >
              <View style={styles.catCardTop}>
                <View style={styles.catIconBox}>
                  <Ionicons name={cat.icon} size={22} color={cat.color} />
                </View>

                <View style={[styles.catBadgePill, { backgroundColor: cat.color }]}>
                  <Text style={styles.catBadgeText}>{cat.badge}</Text>
                </View>
              </View>

              <Text style={styles.catTitle}>{cat.title}</Text>
              <Text style={styles.catSubtitle}>{cat.subtitle}</Text>

              <View style={styles.catFooter}>
                <View style={styles.catMetaRow}>
                  <Ionicons name="help-circle-outline" size={14} color="#64748B" />
                  <Text style={styles.catMetaText}>{cat.questions} Questions</Text>
                </View>
                <View style={styles.catPlayBtn}>
                  <Ionicons name="chevron-forward" size={16} color={cat.color} />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

/* ─────────────── STYLES ─────────────── */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingBottom: 24,
  },

  /* ── TOP HEADER ── */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 12,
  },
  avatarImg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#0284C7',
  },
  levelBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#0284C7',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  levelBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  userMeta: {
    justifyContent: 'center',
  },
  greetText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  userNameText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  rankText: {
    fontSize: 11,
    color: '#0284C7',
    fontWeight: '700',
  },
  xpPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    gap: 4,
  },
  xpPillText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#92400E',
    marginLeft: 3,
  },

  /* ── DAILY CHALLENGE ── */
  dailyCardWrapper: {
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 24,
  },
  dailyCard: {
    borderRadius: 20,
    padding: 20,
    elevation: 4,
    shadowColor: '#0056D2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  dailyTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dailyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  dailyBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0056D2',
    letterSpacing: 0.5,
    marginLeft: 3,
  },
  dailyProgressText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.9)',
  },
  dailyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  dailySub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.82)',
    marginBottom: 14,
    lineHeight: 18,
  },
  progressTrack: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },
  dailyBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dailyReward: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FEF3C7',
  },
  dailyStartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 4,
  },
  dailyStartBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0056D2',
    marginRight: 2,
  },

  /* ── SECTION HEADER ── */
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },

  /* ── FEATURED DRILLS ── */
  featuredScroll: {
    paddingLeft: 20,
    paddingRight: 8,
    paddingBottom: 24,
  },
  featuredCard: {
    width: width * 0.68,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginRight: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  featuredIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featuredCardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  featuredCardDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
    marginBottom: 14,
  },
  featuredFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featuredMetaPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  featuredMetaText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  featuredXpPill: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  featuredXpText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#92400E',
  },

  /* ── CATEGORIES GRID ── */
  categoriesGrid: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryCard: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    marginBottom: 4,
  },
  catCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  catIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  catBadgePill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  catBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  catTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  catSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 12,
  },
  catFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: 10,
  },
  catMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  catMetaText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginLeft: 3,
  },
  catPlayBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
  },

  bottomSpacer: {
    height: 20,
  },
});
