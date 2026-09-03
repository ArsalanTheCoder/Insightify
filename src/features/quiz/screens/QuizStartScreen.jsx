/**
 * Insightify — QuizStartScreen (Quiz Feature Screen)
 *
 * Pre-quiz context screen:
 * - Illustration (assets/quiz/quiz-start.png)
 * - Quiz title, difficulty badge, and description
 * - 3-column metadata row (Questions, Duration, XP Reward)
 * - "You'll learn:" checklist
 * - "Start Quiz" gradient CTA button
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
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useResponsive } from '../../../shared/utils/responsive';
import ScreenContainer from '../../../shared/components/ScreenContainer';
import { useQuiz } from '../hooks/useQuiz';
import DifficultyBadge from '../components/DifficultyBadge';
import QuizMetaRow from '../components/QuizMetaRow';

const QUIZ_START_IMAGE = require('../../../../assets/quiz/quiz-start.png');

export default function QuizStartScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { colors, typography, radii } = useTheme();
  const insets = useSafeAreaInsets();
  const { scaleFont, moderateScale } = useResponsive();

  const quizId = route.params?.quizId || 'phishing-basics';
  const { quiz, isLoading } = useQuiz(quizId);

  const handleStartQuiz = () => {
    navigation.navigate('QuizRules', {
      quizId,
      quizTitle: quiz?.title || 'Phishing Basics',
    });
  };

  const bottomScrollPadding = (insets.bottom || 0) + 90;

  if (isLoading || !quiz) {
    return (
      <ScreenContainer withPadding={true} style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  const imageSize = moderateScale(130);

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
          Quiz Start
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      {/* 2. Hero Illustration */}
      <View style={styles.imageContainer}>
        <Image
          source={QUIZ_START_IMAGE}
          style={{ width: imageSize, height: imageSize }}
          resizeMode="contain"
        />
      </View>

      {/* 3. Title & Badge */}
      <View style={styles.titleContainer}>
        <Text
          style={[
            typography.h1,
            styles.quizTitle,
            { color: colors.textPrimary, fontSize: scaleFont(22, 0.3) },
          ]}
        >
          {quiz.title}
        </Text>

        {quiz.difficulty ? (
          <DifficultyBadge
            difficulty={quiz.difficulty}
            suffix="Level"
            style={styles.difficultyBadge}
          />
        ) : null}

        <Text
          style={[
            typography.body,
            styles.quizDesc,
            { color: colors.textSecondary, fontSize: scaleFont(13.5, 0.3) },
          ]}
        >
          {quiz.description}
        </Text>
      </View>

      {/* 4. Metadata Row */}
      <QuizMetaRow
        questions={quiz.questionCount || 5}
        durationMinutes={quiz.durationMinutes || 5}
        xpReward={quiz.xpReward || 50}
      />

      {/* 5. You'll Learn Section */}
      <View style={styles.learnSection}>
        <Text
          style={[
            typography.h3,
            styles.learnTitle,
            { color: colors.textPrimary, fontSize: scaleFont(14.5, 0.3) },
          ]}
        >
          You'll learn:
        </Text>

        {(quiz.learningObjectives || []).map((item) => (
          <View key={item} style={styles.bulletRow}>
            <Text style={[styles.bulletDot, { color: colors.primary }]}>•</Text>
            <Text
              style={[
                typography.body,
                styles.bulletText,
                { color: colors.textSecondary, fontSize: scaleFont(13, 0.3) },
              ]}
            >
              {item}
            </Text>
          </View>
        ))}
      </View>

      {/* 6. Start Quiz CTA */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handleStartQuiz}
        style={styles.startBtnWrap}
        accessibilityRole="button"
        accessibilityLabel="Start Quiz"
      >
        <LinearGradient
          colors={['#245BFF', '#A63DFF']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={[styles.startBtn, { borderRadius: radii.large }]}
        >
          <Text
            style={[
              styles.startBtnText,
              { fontSize: scaleFont(15, 0.3) },
            ]}
          >
            Start Quiz
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
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
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
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  titleContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  quizTitle: {
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  difficultyBadge: {
    marginBottom: 10,
  },
  quizDesc: {
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '500',
  },
  learnSection: {
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  learnTitle: {
    fontWeight: '800',
    marginBottom: 10,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
    paddingLeft: 4,
  },
  bulletDot: {
    fontSize: 16,
    lineHeight: 18,
    marginRight: 8,
    fontWeight: '900',
  },
  bulletText: {
    flex: 1,
    lineHeight: 19,
    fontWeight: '500',
  },
  startBtnWrap: {
    width: '100%',
    marginTop: 4,
    elevation: 3,
    shadowColor: '#245BFF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  startBtn: {
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
