/**
 * Insightify — QuizCard (Quiz Component)
 *
 * Reusable list card for QuizLibraryScreen and Continue Learning on Dashboard.
 *
 * AGENTS.md & docs/RULES.md & RFC-005-F
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useResponsive } from '../../../shared/utils/responsive';
import DifficultyBadge from './DifficultyBadge';

export default function QuizCard({
  quiz,
  onPress,
  isContinueMode = false,
  onContinue,
}) {
  const { colors, typography, radii } = useTheme();
  const { scaleFont } = useResponsive();

  const isAvailable = quiz.available !== false;
  const iconColor = colors[quiz.colorKey] || colors.primary;

  const handleCardPress = () => {
    onPress?.(quiz);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={handleCardPress}
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: radii.large,
          opacity: isAvailable ? 1 : 0.65,
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${quiz.title}, ${quiz.questionCount} questions`}
    >
      {/* Icon Badge */}
      <View
        style={[
          styles.iconWrap,
          {
            backgroundColor: colors.surfaceSecondary,
            borderRadius: 12,
          },
        ]}
      >
        <Ionicons name={quiz.categoryIcon || 'book'} size={22} color={iconColor} />
      </View>

      {/* Title & details */}
      <View style={styles.infoWrap}>
        <Text
          numberOfLines={1}
          style={[
            typography.h3,
            styles.title,
            { color: colors.textPrimary, fontSize: scaleFont(14.5, 0.3) },
          ]}
        >
          {quiz.title}
        </Text>

        {isContinueMode ? (
          <View style={styles.continueSubtitleRow}>
            <Text
              style={[
                typography.caption,
                styles.subtitle,
                { color: colors.textSecondary, fontSize: scaleFont(12, 0.3) },
              ]}
            >
              {quiz.questionCount} Questions
            </Text>
            <Text
              style={[
                typography.caption,
                styles.subtitle,
                { color: colors.textTertiary, fontSize: scaleFont(11.5, 0.3) },
              ]}
            >
              • Last played
            </Text>
          </View>
        ) : (
          <View style={styles.detailsRow}>
            <Text
              style={[
                typography.caption,
                styles.subtitle,
                { color: colors.textSecondary, fontSize: scaleFont(12, 0.3) },
              ]}
            >
              {quiz.questionCount} Questions
            </Text>
            {quiz.difficulty && (
              <DifficultyBadge difficulty={quiz.difficulty} style={styles.diffBadge} />
            )}
          </View>
        )}
      </View>

      {/* Right side action / score / lock */}
      {isContinueMode ? (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onContinue?.(quiz)}
          style={[
            styles.continueBtn,
            {
              borderColor: colors.primary,
              borderRadius: radii.pill || 999,
            },
          ]}
        >
          <Text
            style={[
              styles.continueBtnText,
              { color: colors.primary, fontSize: scaleFont(12, 0.3) },
            ]}
          >
            Continue
          </Text>
        </TouchableOpacity>
      ) : isAvailable ? (
        <View style={styles.rightGroup}>
          {quiz.score != null ? (
            <View style={styles.scoreWrap}>
              <Text
                style={[
                  styles.scoreText,
                  { color: colors.correct, fontSize: scaleFont(13, 0.3) },
                ]}
              >
                {quiz.score}%
              </Text>
              <Text
                style={[
                  styles.scoreSub,
                  { color: colors.textTertiary, fontSize: scaleFont(10.5, 0.3) },
                ]}
              >
                Score
              </Text>
            </View>
          ) : null}
          <Ionicons
            name="chevron-forward"
            size={16}
            color={colors.textTertiary}
            style={styles.chevron}
          />
        </View>
      ) : (
        <View style={styles.rightGroup}>
          {quiz.score != null ? (
            <View style={styles.scoreWrap}>
              <Text
                style={[
                  styles.scoreText,
                  { color: colors.correct, fontSize: scaleFont(13, 0.3) },
                ]}
              >
                {quiz.score}%
              </Text>
              <Text
                style={[
                  styles.scoreSub,
                  { color: colors.textTertiary, fontSize: scaleFont(10.5, 0.3) },
                ]}
              >
                Score
              </Text>
            </View>
          ) : (
            <Ionicons name="lock-closed-outline" size={18} color={colors.textTertiary} />
          )}
          <Ionicons
            name="chevron-forward"
            size={16}
            color={colors.textTertiary}
            style={styles.chevron}
          />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  iconWrap: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoWrap: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontWeight: '800',
    marginBottom: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  continueSubtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  subtitle: {
    fontWeight: '500',
  },
  diffBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  scoreWrap: {
    alignItems: 'flex-end',
    marginRight: 4,
  },
  scoreText: {
    fontWeight: '800',
    lineHeight: 16,
  },
  scoreSub: {
    fontWeight: '500',
  },
  chevron: {
    marginLeft: 2,
  },
  continueBtn: {
    borderWidth: 1.5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueBtnText: {
    fontWeight: '700',
  },
});
