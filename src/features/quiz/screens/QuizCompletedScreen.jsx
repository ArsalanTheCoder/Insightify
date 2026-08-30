/**
 * Insightify — QuizCompletedScreen (Quiz Feature Screen)
 *
 * Post-quiz celebration screen:
 * - Prominent Trophy illustration (assets/quiz/quiz-completed.png)
 * - Score percentage & correct answer count
 * - 2-metric card row (+XP Earned, Time Taken)
 * - "View Results" gradient CTA
 * - "Back to Quizzes" (QuizLibrary) outline button with clean navigation reset
 *
 * AGENTS.md & docs/RULES.md & RFC-005-F
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useResponsive } from '../../../shared/utils/responsive';
import ScreenContainer from '../../../shared/components/ScreenContainer';
import { formatTimeTaken } from '../utils/quizUtils';

const QUIZ_COMPLETED_IMAGE = require('../../../../assets/quiz/quiz-completed.png');

export default function QuizCompletedScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { colors, typography, radii } = useTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { scaleFont, moderateScale } = useResponsive();

  const {
    quizId = 'phishing-basics',
    quizTitle = 'Phishing Basics',
    answers = [],
    timeTakenMs = 165000,
    totalQuestions = 5,
    correctCount = 4,
    scorePercent = 80,
    earnedXp = 40,
  } = route.params || {};

  const formattedTime = formatTimeTaken(timeTakenMs);

  const handleViewResults = () => {
    navigation.navigate('QuizResults', {
      quizId,
      quizTitle,
      answers,
      timeTakenMs,
      totalQuestions,
      correctCount,
      scorePercent,
      earnedXp,
    });
  };

  /**
   * Resets the stack to [QuizDashboard, QuizLibrary] so that
   * pressing back on QuizLibrary cleanly returns to QuizDashboard.
   */
  const handleBackToQuizzes = () => {
    navigation.reset({
      index: 1,
      routes: [{ name: 'QuizDashboard' }, { name: 'QuizLibrary' }],
    });
  };

  const bottomScrollPadding = (insets.bottom || 0) + 95;
  const trophySize = Math.min(moderateScale(200), width * 0.52);

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
          onPress={handleBackToQuizzes}
          style={[styles.backBtn, { backgroundColor: colors.surfaceSecondary }]}
          accessibilityRole="button"
          accessibilityLabel="Back to quizzes"
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
          Quiz Completed!
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      {/* 2. Prominent Trophy Hero Illustration */}
      <View style={styles.trophyContainer}>
        <Image
          source={QUIZ_COMPLETED_IMAGE}
          style={{ width: trophySize, height: trophySize }}
          resizeMode="contain"
        />
      </View>

      {/* 3. Score Card */}
      <View
        style={[
          styles.scoreCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: radii.large,
          },
        ]}
      >
        <Text
          style={[
            typography.caption,
            styles.scoreLabel,
            { color: colors.textSecondary, fontSize: scaleFont(13, 0.3) },
          ]}
        >
          Your Score
        </Text>

        <Text
          style={[
            typography.h1,
            styles.scorePercentText,
            { color: colors.correct || '#20B86B', fontSize: scaleFont(36, 0.4) },
          ]}
        >
          {scorePercent}%
        </Text>

        <Text
          style={[
            typography.body,
            styles.scoreFractionText,
            { color: colors.textPrimary, fontSize: scaleFont(14.5, 0.3) },
          ]}
        >
          {correctCount} / {totalQuestions} Correct
        </Text>
      </View>

      {/* 4. Metric Boxes (XP Earned, Time Taken) */}
      <View style={styles.metricsRow}>
        <View
          style={[
            styles.metricBox,
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
              styles.metricVal,
              { color: colors.correct || '#20B86B', fontSize: scaleFont(17, 0.3) },
            ]}
          >
            +{earnedXp} XP
          </Text>
          <Text
            style={[
              typography.caption,
              styles.metricLbl,
              { color: colors.textSecondary, fontSize: scaleFont(11.5, 0.3) },
            ]}
          >
            Earned
          </Text>
        </View>

        <View
          style={[
            styles.metricBox,
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
              styles.metricVal,
              { color: colors.primary, fontSize: scaleFont(17, 0.3) },
            ]}
          >
            {formattedTime}
          </Text>
          <Text
            style={[
              typography.caption,
              styles.metricLbl,
              { color: colors.textSecondary, fontSize: scaleFont(11.5, 0.3) },
            ]}
          >
            Time Taken
          </Text>
        </View>
      </View>

      {/* 5. CTAs */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handleViewResults}
        style={styles.viewResultsBtnWrap}
        accessibilityRole="button"
        accessibilityLabel="View Results"
      >
        <LinearGradient
          colors={['#245BFF', '#A63DFF']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={[styles.viewResultsBtn, { borderRadius: radii.large }]}
        >
          <Text
            style={[
              styles.viewResultsBtnText,
              { fontSize: scaleFont(15, 0.3) },
            ]}
          >
            View Results
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.75}
        onPress={handleBackToQuizzes}
        style={[
          styles.backQuizzesBtn,
          {
            backgroundColor: 'transparent',
            borderRadius: radii.large,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Back to Quizzes"
      >
        <Text
          style={[
            styles.backQuizzesText,
            { color: colors.primary, fontSize: scaleFont(14, 0.3) },
          ]}
        >
          Back to Quizzes
        </Text>
      </TouchableOpacity>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 6,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
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
  trophyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  scoreCard: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  scoreLabel: {
    fontWeight: '600',
    marginBottom: 4,
  },
  scorePercentText: {
    fontWeight: '900',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  scoreFractionText: {
    fontWeight: '700',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  metricBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
  },
  metricVal: {
    fontWeight: '900',
    marginBottom: 2,
  },
  metricLbl: {
    fontWeight: '600',
  },
  viewResultsBtnWrap: {
    width: '100%',
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#245BFF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  viewResultsBtn: {
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewResultsBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  backQuizzesBtn: {
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backQuizzesText: {
    fontWeight: '700',
  },
});
