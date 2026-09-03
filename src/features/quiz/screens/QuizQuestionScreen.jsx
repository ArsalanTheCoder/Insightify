/**
 * Insightify — QuizQuestionScreen (Quiz Feature Screen)
 *
 * Single Reusable Question Screen for the entire multiple-choice question flow.
 * Handles sequential question advancement, option selection, submit validation,
 * feedback highlight, and transition to QuizCompletedScreen.
 *
 * Fixed layout ensures Submit Answer / Next / Finish button is always visible
 * above the floating bottom navigation.
 *
 * AGENTS.md & docs/RULES.md & RFC-005-F
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
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
import { useQuizProgressStore } from '../store/useQuizProgressStore';
import { calculateScorePercent, calculateXpEarned } from '../utils/quizUtils';
import QuizProgressDots from '../components/QuizProgressDots';
import QuizAnswerOption from '../components/QuizAnswerOption';

export default function QuizQuestionScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { colors, typography, radii } = useTheme();
  const insets = useSafeAreaInsets();
  const { scaleFont } = useResponsive();

  const quizId = route.params?.quizId || 'phishing-basics';
  const { quiz, questions, isLoading } = useQuiz(quizId);
  const { recordQuizCompletion, setInProgressQuiz } = useQuizProgressStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [answers, setAnswers] = useState([]); // [{ questionId, selectedOptionId, isCorrect, correctOptionId }]
  const startTimeRef = useRef(Date.now());

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const isLastQuestion = currentIndex === totalQuestions - 1;

  // Track in-progress state for "Continue Learning"
  useEffect(() => {
    if (quiz && currentQuestion) {
      setInProgressQuiz({
        quizId,
        title: quiz.title,
        questionCount: totalQuestions,
        questionIndex: currentIndex,
        lastPlayed: 'Just now',
      });
    }
  }, [quiz, currentQuestion, currentIndex, quizId, totalQuestions, setInProgressQuiz]);

  const handleSelectOption = (optionId) => {
    if (isSubmitted) {
      return;
    }
    setSelectedOptionId(optionId);
  };

  const handleSubmitOrNext = () => {
    if (!isSubmitted) {
      // Step 1: Submit and validate answer
      if (!selectedOptionId) {
        return;
      }

      const isCorrect = selectedOptionId === currentQuestion.correctOptionId;
      const newAnswer = {
        questionId: currentQuestion.id,
        questionNumber: currentQuestion.number,
        questionText: currentQuestion.text,
        selectedOptionId,
        selectedOptionText: currentQuestion.options.find((o) => o.id === selectedOptionId)?.text || '',
        correctOptionId: currentQuestion.correctOptionId,
        correctOptionText: currentQuestion.options.find((o) => o.id === currentQuestion.correctOptionId)?.text || '',
        isCorrect,
        explanation: currentQuestion.explanation,
      };

      setAnswers((prev) => [...prev, newAnswer]);
      setIsSubmitted(true);
    } else {
      // Step 2: Next question or finish
      if (isLastQuestion) {
        // Complete quiz session
        const timeTakenMs = Date.now() - startTimeRef.current;
        const finalAnswers = answers;
        const correctCount = finalAnswers.filter((a) => a.isCorrect).length;
        const scorePercent = calculateScorePercent(correctCount, totalQuestions);
        const earnedXp = calculateXpEarned(quiz?.xpReward || 50, correctCount, totalQuestions);

        recordQuizCompletion({
          quizId,
          score: scorePercent,
          earnedXp,
        });

        navigation.replace('QuizCompleted', {
          quizId,
          quizTitle: quiz?.title || 'Phishing Basics',
          answers: finalAnswers,
          timeTakenMs,
          totalQuestions,
          correctCount,
          scorePercent,
          earnedXp,
        });
      } else {
        // Advance to next question
        setCurrentIndex((prev) => prev + 1);
        setSelectedOptionId(null);
        setIsSubmitted(false);
      }
    }
  };

  const bottomScrollPadding = (insets.bottom || 0) + 95;

  if (isLoading || !currentQuestion) {
    return (
      <ScreenContainer withPadding={true} style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  const isButtonDisabled = !selectedOptionId && !isSubmitted;

  let buttonText = 'Submit Answer';
  if (isSubmitted) {
    buttonText = isLastQuestion ? 'Finish Quiz →' : 'Next →';
  }

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
      {/* 1. Header: Question Counter & XP Badge */}
      <View style={styles.headerRow}>
        <Text
          style={[
            typography.h2,
            styles.questionCounter,
            { color: colors.textPrimary, fontSize: scaleFont(18, 0.3) },
          ]}
        >
          Question {currentIndex + 1} of {totalQuestions}
        </Text>

        <View
          style={[
            styles.xpBadge,
            {
              backgroundColor: colors.xpSoft || '#FFF7E6',
              borderRadius: radii.pill || 999,
            },
          ]}
        >
          <Ionicons name="sparkles" size={13} color={colors.xp || '#F59E0B'} />
          <Text
            style={[
              styles.xpText,
              { color: colors.xp || '#F59E0B', fontSize: scaleFont(12, 0.3) },
            ]}
          >
            {currentQuestion.xp || 100} XP
          </Text>
        </View>
      </View>

      {/* 2. Progress Dots */}
      <QuizProgressDots
        total={totalQuestions}
        currentIndex={currentIndex}
      />

      {/* 3. Question Text */}
      <Text
        style={[
          typography.h1,
          styles.questionText,
          { color: colors.textPrimary, fontSize: scaleFont(18, 0.3) },
        ]}
      >
        {currentQuestion.text}
      </Text>

      {/* 4. Options List */}
      <View style={styles.optionsList}>
        {currentQuestion.options.map((option) => {
          const isSelected = selectedOptionId === option.id;
          const isCorrect = option.id === currentQuestion.correctOptionId;
          const isUserSelection = isSelected;

          return (
            <QuizAnswerOption
              key={option.id}
              option={option}
              isSelected={isSelected}
              isSubmitted={isSubmitted}
              isCorrect={isCorrect}
              isUserSelection={isUserSelection}
              onPress={handleSelectOption}
            />
          );
        })}
      </View>

      {/* 5. Submit / Next / Finish CTA (placed naturally after options, safely above bottom nav) */}
      <TouchableOpacity
        activeOpacity={0.85}
        disabled={isButtonDisabled}
        onPress={handleSubmitOrNext}
        style={[
          styles.submitBtnWrap,
          { opacity: isButtonDisabled ? 0.45 : 1 },
        ]}
        accessibilityRole="button"
        accessibilityLabel={buttonText}
      >
        <LinearGradient
          colors={['#245BFF', '#A63DFF']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={[styles.submitBtn, { borderRadius: radii.large }]}
        >
          <Text
            style={[
              styles.submitBtnText,
              { fontSize: scaleFont(15, 0.3) },
            ]}
          >
            {buttonText}
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
    marginBottom: 4,
  },
  questionCounter: {
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 4,
  },
  xpText: {
    fontWeight: '800',
  },
  questionText: {
    fontWeight: '800',
    lineHeight: 24,
    marginTop: 10,
    marginBottom: 18,
    letterSpacing: -0.2,
  },
  optionsList: {
    paddingBottom: 4,
  },
  submitBtnWrap: {
    width: '100%',
    marginTop: 10,
    marginBottom: 8,
    elevation: 3,
    shadowColor: '#245BFF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  submitBtn: {
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
