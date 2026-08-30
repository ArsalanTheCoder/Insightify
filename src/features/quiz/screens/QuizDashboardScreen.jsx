/**
 * Insightify — QuizDashboardScreen (Quiz Feature Screen)
 *
 * Learn Tab Root Screen:
 * - Header with "Quiz & Games" title and streak badge 🔥 {streak}
 * - XP & Level progress card
 * - 3 summary statistics cards (Quizzes Played, Avg. Score, Day Streak)
 * - Continue Learning card
 * - Categories 2x2 grid
 * - Daily Challenge card
 *
 * AGENTS.md & docs/RULES.md & RFC-005-F
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useResponsive } from '../../../shared/utils/responsive';
import ScreenContainer from '../../../shared/components/ScreenContainer';
import { useQuizDashboard } from '../hooks/useQuizDashboard';
import QuizXpProgressCard from '../components/QuizXpProgressCard';
import QuizCard from '../components/QuizCard';
import CategoryPill from '../components/CategoryPill';
import DailyChallengeCard from '../components/DailyChallengeCard';

export default function QuizDashboardScreen() {
  const navigation = useNavigation();
  const { colors, typography, radii } = useTheme();
  const insets = useSafeAreaInsets();
  const { scaleFont } = useResponsive();

  const {
    userLevel,
    userTitle,
    userXp,
    nextXp,
    streak,
    quizzesPlayed,
    avgScore,
    inProgressQuiz,
    categories,
    dailyChallenge,
  } = useQuizDashboard();

  const handleContinueQuiz = (quiz) => {
    navigation.navigate('QuizStart', {
      quizId: quiz?.quizId || 'phishing-basics',
      quizTitle: quiz?.title || 'Phishing Basics',
    });
  };

  const handleCategoryPress = (_category) => {
    navigation.navigate('QuizLibrary');
  };

  const handleDailyChallenge = () => {
    navigation.navigate('QuizStart', {
      quizId: dailyChallenge?.quizId || 'phishing-basics',
      quizTitle: dailyChallenge?.title || 'Spot the Real Link',
    });
  };

  const bottomScrollPadding = (insets.bottom || 0) + 90;

  return (
    <ScreenContainer
      scrollable={true}
      withPadding={true}
      contentContainerStyle={[
        styles.scrollContent,
        { paddingBottom: bottomScrollPadding },
      ]}
      style={styles.container}
    >
      {/* 1. Header */}
      <View style={styles.headerRow}>
        <Text
          style={[
            typography.h1,
            styles.headerTitle,
            { color: colors.textPrimary, fontSize: scaleFont(22, 0.3) },
          ]}
        >
          Quiz & Games
        </Text>

        {/* Streak indicator badge (NOT notification) */}
        <View
          style={[
            styles.streakBadge,
            {
              backgroundColor: colors.xpSoft || '#FFF7E6',
              borderRadius: radii.pill || 999,
            },
          ]}
          accessibilityLabel={`Quiz streak: ${streak} days`}
        >
          <Text style={[styles.streakFire, { fontSize: scaleFont(14, 0.3) }]}>
            🔥
          </Text>
          <Text
            style={[
              styles.streakCount,
              { color: colors.xp || '#F59E0B', fontSize: scaleFont(13, 0.3) },
            ]}
          >
            {streak}
          </Text>
        </View>
      </View>

      {/* 2. XP Progress Card */}
      <QuizXpProgressCard
        level={userLevel}
        title={userTitle}
        xp={userXp}
        nextXp={nextXp}
      />

      {/* 3. Statistics 3-Box Row */}
      <View style={styles.statsRow}>
        <View
          style={[
            styles.statCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: radii.large,
            },
          ]}
        >
          <Text
            style={[
              typography.h2,
              styles.statNum,
              { color: colors.primary, fontSize: scaleFont(18, 0.3) },
            ]}
          >
            {quizzesPlayed}
          </Text>
          <Text
            style={[
              typography.caption,
              styles.statLbl,
              { color: colors.textSecondary, fontSize: scaleFont(11, 0.3) },
            ]}
          >
            Quizzes Played
          </Text>
        </View>

        <View
          style={[
            styles.statCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: radii.large,
            },
          ]}
        >
          <Text
            style={[
              typography.h2,
              styles.statNum,
              { color: colors.correct, fontSize: scaleFont(18, 0.3) },
            ]}
          >
            {avgScore}%
          </Text>
          <Text
            style={[
              typography.caption,
              styles.statLbl,
              { color: colors.textSecondary, fontSize: scaleFont(11, 0.3) },
            ]}
          >
            Avg. Score
          </Text>
        </View>

        <View
          style={[
            styles.statCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: radii.large,
            },
          ]}
        >
          <Text
            style={[
              typography.h2,
              styles.statNum,
              { color: colors.xp, fontSize: scaleFont(18, 0.3) },
            ]}
          >
            {streak}
          </Text>
          <Text
            style={[
              typography.caption,
              styles.statLbl,
              { color: colors.textSecondary, fontSize: scaleFont(11, 0.3) },
            ]}
          >
            Day Streak
          </Text>
        </View>
      </View>

      {/* 4. Continue Learning */}
      <View style={styles.sectionHeaderRow}>
        <Text
          style={[
            typography.h3,
            styles.sectionTitle,
            { color: colors.textPrimary, fontSize: scaleFont(15, 0.3) },
          ]}
        >
          Continue Learning
        </Text>
      </View>

      {inProgressQuiz ? (
        <QuizCard
          quiz={inProgressQuiz}
          isContinueMode={true}
          onPress={() => handleContinueQuiz(inProgressQuiz)}
          onContinue={() => handleContinueQuiz(inProgressQuiz)}
        />
      ) : (
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => navigation.navigate('QuizLibrary')}
          style={[
            styles.emptyContinueCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: radii.large,
            },
          ]}
        >
          <Text
            style={[
              typography.body,
              { color: colors.textSecondary, fontSize: scaleFont(13, 0.3) },
            ]}
          >
            Start a quiz to continue learning here!
          </Text>
        </TouchableOpacity>
      )}

      {/* 5. Categories */}
      <View style={styles.sectionHeaderRow}>
        <Text
          style={[
            typography.h3,
            styles.sectionTitle,
            { color: colors.textPrimary, fontSize: scaleFont(15, 0.3) },
          ]}
        >
          Categories
        </Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('QuizLibrary')}
        >
          <Text
            style={[
              styles.seeAllText,
              { color: colors.primary, fontSize: scaleFont(12.5, 0.3) },
            ]}
          >
            See All
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.categoriesGrid}>
        <View style={styles.categoriesRow}>
          {categories.slice(0, 2).map((cat) => (
            <CategoryPill
              key={cat.id}
              category={cat}
              onPress={handleCategoryPress}
            />
          ))}
        </View>
        <View style={styles.categoriesRow}>
          {categories.slice(2, 4).map((cat) => (
            <CategoryPill
              key={cat.id}
              category={cat}
              onPress={handleCategoryPress}
            />
          ))}
        </View>
      </View>

      {/* 6. Daily Challenge */}
      <DailyChallengeCard
        challenge={dailyChallenge}
        onPlay={handleDailyChallenge}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerTitle: {
    fontWeight: '900',
    letterSpacing: -0.4,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 3,
  },
  streakFire: {
    lineHeight: 18,
  },
  streakCount: {
    fontWeight: '800',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
  },
  statNum: {
    fontWeight: '900',
    marginBottom: 2,
  },
  statLbl: {
    fontWeight: '600',
    textAlign: 'center',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 4,
  },
  sectionTitle: {
    fontWeight: '800',
  },
  seeAllText: {
    fontWeight: '700',
  },
  emptyContinueCard: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginBottom: 12,
  },
  categoriesGrid: {
    gap: 8,
    marginBottom: 16,
  },
  categoriesRow: {
    flexDirection: 'row',
    gap: 8,
  },
});
