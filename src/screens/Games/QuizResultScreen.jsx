import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Animated,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

export default function QuizResultScreen({ route, navigation }) {
  const total = route?.params?.total || 4;
  const correct = route?.params?.correct || 0;
  const xpEarned = route?.params?.xpEarned || 0;
  const wrong = route?.params?.wrong || 0;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.stagger(100, [
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [scaleAnim, opacityAnim, slideAnim]);

  const getTrophy = () => {
    if (accuracy >= 90) { return { icon: 'trophy', color: '#D97706', label: 'Cyber Guardian 🏆' }; }
    if (accuracy >= 70) { return { icon: 'ribbon', color: '#0056D2', label: 'Great Job! 🎉' }; }
    if (accuracy >= 50) { return { icon: 'star', color: '#0284C7', label: 'Good Effort! 💪' }; }
    return { icon: 'alert-circle', color: '#DC2626', label: 'Keep Practicing 📖' };
  };

  const trophy = getTrophy();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('QuizHome')}>
          <Ionicons name="close" size={20} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quiz Results</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Hero Score Card */}
      <Animated.View style={[styles.heroCardWrapper, { transform: [{ scale: scaleAnim }] }]}>
        <LinearGradient
          colors={['#0056D2', '#0284C7']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <View style={styles.trophyIconBox}>
            <Ionicons name={trophy.icon} size={36} color="#FFFFFF" />
          </View>

          <Text style={styles.trophyLabel}>{trophy.label}</Text>
          <Text style={styles.scoreAccuracyText}>{accuracy}% Score</Text>

          <View style={styles.scorePill}>
            <Text style={styles.scorePillText}>{correct} of {total} Correct</Text>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Stats Cards */}
      <Animated.View
        style={[
          styles.statsContainer,
          {
            opacity: opacityAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.statCard}>
          <View style={[styles.statIconBox, styles.statIconBoxGreen]}>
            <Ionicons name="checkmark-circle" size={22} color="#059669" />
          </View>
          <Text style={styles.statValue}>{correct}</Text>
          <Text style={styles.statLabel}>Correct</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIconBox, styles.statIconBoxRed]}>
            <Ionicons name="close-circle" size={22} color="#DC2626" />
          </View>
          <Text style={styles.statValue}>{wrong}</Text>
          <Text style={styles.statLabel}>Wrong</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIconBox, styles.statIconBoxAmber]}>
            <Ionicons name="flash" size={22} color="#D97706" />
          </View>
          <Text style={styles.statValue}>+{xpEarned}</Text>
          <Text style={styles.statLabel}>XP Earned</Text>
        </View>
      </Animated.View>

      {/* User Ribbon */}
      <Animated.View
        style={[
          styles.userRibbon,
          {
            opacity: opacityAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Ionicons name="person-circle" size={36} color="#0056D2" />
        <View style={styles.userMeta}>
          <Text style={styles.userName}>Muhammad Maaz</Text>
          <Text style={styles.userTitle}>Cyber Guardian</Text>
        </View>
        <View style={styles.xpRibbonBadge}>
          <Ionicons name="flash" size={12} color="#92400E" />
          <Text style={styles.xpRibbonText}>+{xpEarned} XP</Text>
        </View>
      </Animated.View>

      {/* Bottom Buttons */}
      <Animated.View
        style={[
          styles.bottomActions,
          {
            opacity: opacityAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.goBack()}
          style={styles.retryBtn}
        >
          <Ionicons name="refresh" size={18} color="#0056D2" />
          <Text style={styles.retryBtnText}>Try Again</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate('QuizHome')}
          style={styles.exploreBtnWrapper}
        >
          <LinearGradient
            colors={['#0056D2', '#0284C7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.exploreBtn}
          >
            <Text style={styles.exploreBtnText}>Done</Text>
            <Ionicons name="arrow-forward" size={16} color="#FFF" />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

/* ─────────────── STYLES ─────────────── */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 20,
  },

  /* HEADER */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSpacer: {
    width: 38,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },

  /* HERO CARD */
  heroCardWrapper: {
    marginTop: 12,
    marginBottom: 20,
  },
  heroCard: {
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#0056D2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  trophyIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  trophyLabel: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  scoreAccuracyText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '600',
    marginBottom: 12,
  },
  scorePill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 14,
  },
  scorePillText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0056D2',
  },

  /* STATS */
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 1,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  statIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statIconBoxGreen: {
    backgroundColor: '#ECFDF5',
  },
  statIconBoxRed: {
    backgroundColor: '#FEF2F2',
  },
  statIconBoxAmber: {
    backgroundColor: '#FEF3C7',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },

  /* USER RIBBON */
  userRibbon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 24,
  },
  userMeta: {
    flex: 1,
    marginLeft: 10,
  },
  userName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  userTitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  xpRibbonBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    gap: 3,
  },
  xpRibbonText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#92400E',
    marginLeft: 2,
  },

  /* BOTTOM ACTIONS */
  bottomActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 'auto',
    paddingBottom: 16,
  },
  retryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#0056D2',
    gap: 6,
  },
  retryBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0056D2',
  },
  exploreBtnWrapper: {
    flex: 1.5,
  },
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 6,
  },
  exploreBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
