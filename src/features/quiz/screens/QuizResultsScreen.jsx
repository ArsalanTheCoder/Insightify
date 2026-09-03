/**
 * Insightify — QuizResultsScreen (Quiz Feature Screen)
 *
 * Detailed Results Breakdown Screen:
 * - Header with Back button and "Results" title
 * - Quiz card banner (icon, title, difficulty)
 * - Multi-color segmented Donut chart score ring
 * - Performance summary stat rows (Correct, Wrong, Skipped)
 * - "Review Answers" outline CTA
 * - "Back to Dashboard" (QuizDashboard) gradient CTA with clean navigation reset
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
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useResponsive } from '../../../shared/utils/responsive';
import ScreenContainer from '../../../shared/components/ScreenContainer';
import DifficultyBadge from '../components/DifficultyBadge';
import QuizResultDonut from '../components/QuizResultDonut';
import QuizStatRow from '../components/QuizStatRow';

export default function QuizResultsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { colors, typography, radii } = useTheme();
  const insets = useSafeAreaInsets();
  const { scaleFont } = useResponsive();

  const {
    quizTitle = 'Phishing Basics',
    answers = [],
    totalQuestions = 5,
    correctCount = 4,
    scorePercent = 80,
  } = route.params || {};

  const wrongCount = Math.max(0, totalQuestions - correctCount);
  const skippedCount = 0;

  const handleReviewAnswers = () => {
    navigation.navigate('QuizReview', {
      quizTitle,
      answers,
    });
  };

  const handleBackToDashboard = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'QuizDashboard' }],
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
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
          style={[styles.backBtn, { backgroundColor: colors.surfaceSecondary }]}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>

        <Text
          style={[
            typography.h2,
            styles.headerTitle,
            { color: colors.textPrimary, fontSize: scaleFont(19, 0.3) },
          ]}
        >
          Results
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      {/* 2. Quiz Info Header Card */}
      <View
        style={[
          styles.quizHeaderCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: radii.large,
          },
        ]}
      >
        <View style={[styles.iconWrap, { backgroundColor: colors.surfaceSecondary, borderRadius: 12 }]}>
          <Ionicons name="bug" size={22} color={colors.danger || '#EF4444'} />
        </View>

        <View style={styles.quizHeaderTextWrap}>
          <Text
            numberOfLines={1}
            style={[
              typography.h2,
              styles.quizTitle,
              { color: colors.textPrimary, fontSize: scaleFont(15, 0.3) },
            ]}
          >
            {quizTitle}
          </Text>
          <DifficultyBadge difficulty="Beginner" suffix="Level" />
        </View>
      </View>

      {/* 3. Multi-Color Segmented Score Donut */}
      <QuizResultDonut
        correctCount={correctCount}
        wrongCount={wrongCount}
        skippedCount={skippedCount}
        totalQuestions={totalQuestions}
        scorePercent={scorePercent}
      />

      <Text
        style={[
          typography.body,
          styles.fractionSummaryText,
          { color: colors.textSecondary, fontSize: scaleFont(13.5, 0.3) },
        ]}
      >
        {correctCount} out of {totalQuestions} correct
      </Text>

      {/* 4. Stat Summary Rows */}
      <QuizStatRow
        correctCount={correctCount}
        wrongCount={wrongCount}
        skippedCount={skippedCount}
      />

      {/* 5. Action Buttons */}
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={handleReviewAnswers}
        style={[
          styles.reviewBtn,
          {
            borderColor: colors.primary,
            backgroundColor: colors.surfaceSecondary,
            borderRadius: radii.large,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Review Answers"
      >
        <Text
          style={[
            styles.reviewBtnText,
            { color: colors.primary, fontSize: scaleFont(14.5, 0.3) },
          ]}
        >
          Review Answers
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handleBackToDashboard}
        style={styles.dashboardBtnWrap}
        accessibilityRole="button"
        accessibilityLabel="Back to Dashboard"
      >
        <LinearGradient
          colors={['#245BFF', '#A63DFF']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={[styles.dashboardBtn, { borderRadius: radii.large }]}
        >
          <Text
            style={[
              styles.dashboardBtnText,
              { fontSize: scaleFont(15, 0.3) },
            ]}
          >
            Back to Dashboard
          </Text>
        </LinearGradient>
      </TouchableOpacity>
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
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  headerSpacer: {
    width: 38,
  },
  quizHeaderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1,
    marginBottom: 6,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
  },
  iconWrap: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  quizHeaderTextWrap: {
    flex: 1,
    gap: 4,
  },
  quizTitle: {
    fontWeight: '800',
  },
  fractionSummaryText: {
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 6,
  },
  reviewBtn: {
    width: '100%',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    marginBottom: 12,
  },
  reviewBtnText: {
    fontWeight: '800',
  },
  dashboardBtnWrap: {
    width: '100%',
    elevation: 3,
    shadowColor: '#245BFF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  dashboardBtn: {
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dashboardBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
