/**
 * Insightify — QuizReviewScreen (Quiz Feature Screen)
 *
 * Question-by-question Answer Review Screen:
 * - Header with Back button and "Review Answers" title
 * - Scrollable list of questions with user's answer, correct answer, and explanation
 * - "Back to Dashboard" gradient CTA at the end of the scroll list above bottom nav
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
import QuizReviewItem from '../components/QuizReviewItem';

export default function QuizReviewScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { colors, typography, radii } = useTheme();
  const insets = useSafeAreaInsets();
  const { scaleFont } = useResponsive();

  const answers = route.params?.answers || [];

  const handleBackToDashboard = () => {
    navigation.navigate('QuizDashboard');
  };

  const bottomScrollPadding = (insets.bottom || 0) + 95;

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
          Review Answers
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      {/* 2. Questions List */}
      <View style={styles.listContainer}>
        {answers.map((ans, index) => (
          <QuizReviewItem
            key={ans.questionId || index}
            question={{
              number: ans.questionNumber || index + 1,
              text: ans.questionText || '',
              explanation: ans.explanation,
            }}
            userAnswerText={ans.selectedOptionText}
            correctAnswerText={ans.correctOptionText}
            isCorrect={ans.isCorrect}
            isLast={index === answers.length - 1}
          />
        ))}
      </View>

      {/* 3. Back to Dashboard CTA */}
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
  listContainer: {
    paddingBottom: 16,
  },
  dashboardBtnWrap: {
    width: '100%',
    marginTop: 8,
    marginBottom: 10,
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
