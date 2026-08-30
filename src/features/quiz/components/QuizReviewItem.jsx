/**
 * Insightify — QuizReviewItem (Quiz Component)
 *
 * Clean, professional, structured Q&A review item:
 * - Clear question title with status badge (Correct / Incorrect)
 * - User's answer with semantic accent styling
 * - Correct answer highlight (if user was wrong)
 * - Educational explanation card with structured layout
 * - Clean divider line
 *
 * AGENTS.md & docs/RULES.md & RFC-005-F
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useResponsive } from '../../../shared/utils/responsive';

export default function QuizReviewItem({
  question,
  userAnswerText = '',
  correctAnswerText = '',
  isCorrect = false,
  isLast = false,
}) {
  const { colors, typography, radii } = useTheme();
  const { scaleFont } = useResponsive();

  const statusColor = isCorrect
    ? (colors.correct || '#20B86B')
    : (colors.error || '#EF4444');

  const statusBg = isCorrect
    ? (colors.correctSoft || '#E9F9F1')
    : (colors.errorSoft || '#FFF0F1');

  return (
    <View
      style={[
        styles.container,
        !isLast && [styles.divider, { borderBottomColor: colors.divider }],
      ]}
    >
      {/* 1. Header: Question Number & Text + Status Pill */}
      <View style={styles.headerRow}>
        <Text
          style={[
            typography.h3,
            styles.questionTitle,
            { color: colors.textPrimary, fontSize: scaleFont(14.5, 0.3) },
          ]}
        >
          {question.number}. {question.text}
        </Text>

        <View
          style={[
            styles.statusPill,
            { backgroundColor: statusBg, borderRadius: radii.pill || 999 },
          ]}
        >
          <Ionicons
            name={isCorrect ? 'checkmark-circle' : 'close-circle'}
            size={13}
            color={statusColor}
          />
          <Text
            style={[
              styles.statusPillText,
              { color: statusColor, fontSize: scaleFont(11.5, 0.3) },
            ]}
          >
            {isCorrect ? 'Correct' : 'Incorrect'}
          </Text>
        </View>
      </View>

      {/* 2. User Answer Section */}
      <View style={styles.answerSection}>
        <Text
          style={[
            typography.caption,
            styles.sectionLabel,
            { color: colors.textTertiary, fontSize: scaleFont(11, 0.3) },
          ]}
        >
          YOUR ANSWER
        </Text>

        <View
          style={[
            styles.answerCard,
            {
              backgroundColor: isCorrect ? statusBg : (colors.surfaceSecondary || '#F1F5FB'),
              borderLeftColor: statusColor,
              borderRadius: radii.medium || 8,
            },
          ]}
        >
          <Text
            style={[
              typography.body,
              styles.answerBodyText,
              {
                color: isCorrect ? statusColor : colors.textPrimary,
                fontSize: scaleFont(13.5, 0.3),
              },
            ]}
          >
            {userAnswerText || 'No answer submitted'}
          </Text>
        </View>
      </View>

      {/* 3. Correct Answer Section (Shown only if user was incorrect) */}
      {!isCorrect && (
        <View style={styles.answerSection}>
          <Text
            style={[
              typography.caption,
              styles.sectionLabel,
              { color: colors.correct || '#20B86B', fontSize: scaleFont(11, 0.3) },
            ]}
          >
            CORRECT ANSWER
          </Text>

          <View
            style={[
              styles.answerCard,
              {
                backgroundColor: colors.correctSoft || '#E9F9F1',
                borderLeftColor: colors.correct || '#20B86B',
                borderRadius: radii.medium || 8,
              },
            ]}
          >
            <Text
              style={[
                typography.body,
                styles.answerBodyText,
                {
                  color: colors.correct || '#20B86B',
                  fontSize: scaleFont(13.5, 0.3),
                },
              ]}
            >
              {correctAnswerText}
            </Text>
          </View>
        </View>
      )}

      {/* 4. Explanation Section */}
      {question.explanation ? (
        <View
          style={[
            styles.explanationCard,
            {
              backgroundColor: colors.surfaceSecondary || '#F1F5FB',
              borderColor: colors.border,
              borderRadius: radii.medium || 8,
            },
          ]}
        >
          <View style={styles.explanationHeader}>
            <Ionicons name="bulb-outline" size={15} color={colors.xp || '#F59E0B'} />
            <Text
              style={[
                typography.caption,
                styles.explanationLabel,
                { color: colors.textSecondary, fontSize: scaleFont(11.5, 0.3) },
              ]}
            >
              Why this matters
            </Text>
          </View>
          <Text
            style={[
              typography.caption,
              styles.explanationText,
              { color: colors.textSecondary, fontSize: scaleFont(12.5, 0.3) },
            ]}
          >
            {question.explanation}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  divider: {
    borderBottomWidth: 1,
  },
  headerRow: {
    marginBottom: 10,
    gap: 8,
  },
  questionTitle: {
    fontWeight: '800',
    lineHeight: 21,
    letterSpacing: -0.2,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 9,
    paddingVertical: 3,
    gap: 4,
  },
  statusPillText: {
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  answerSection: {
    marginBottom: 8,
  },
  sectionLabel: {
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  answerCard: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderLeftWidth: 3.5,
  },
  answerBodyText: {
    fontWeight: '600',
    lineHeight: 19,
  },
  explanationCard: {
    borderWidth: 1,
    padding: 12,
    marginTop: 4,
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4,
  },
  explanationLabel: {
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  explanationText: {
    lineHeight: 18,
    fontWeight: '500',
  },
});
