/**
 * Insightify — QuizAnswerOption (Quiz Component)
 *
 * Single multiple-choice option row on QuizQuestionScreen.
 *
 * AGENTS.md & docs/RULES.md & RFC-005-F
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useResponsive } from '../../../shared/utils/responsive';

export default function QuizAnswerOption({
  option,
  isSelected = false,
  isSubmitted = false,
  isCorrect = false,
  isUserSelection = false,
  onPress,
}) {
  const { colors, typography, radii } = useTheme();
  const { scaleFont } = useResponsive();

  let containerBg = colors.surface;
  let borderColor = colors.border;
  let textColor = colors.textPrimary;
  let radioBg = 'transparent';
  let radioBorder = colors.border;
  let iconName = null;
  let iconColor = '#FFFFFF';

  if (isSubmitted) {
    if (isCorrect) {
      containerBg = colors.correctSoft || '#E9F9F1';
      borderColor = colors.correct || '#20B86B';
      textColor = colors.correct || '#20B86B';
      radioBg = colors.correct || '#20B86B';
      radioBorder = colors.correct || '#20B86B';
      iconName = 'checkmark';
    } else if (isUserSelection) {
      containerBg = colors.errorSoft || '#FFF0F1';
      borderColor = colors.error || '#EF4444';
      textColor = colors.error || '#EF4444';
      radioBg = colors.error || '#EF4444';
      radioBorder = colors.error || '#EF4444';
      iconName = 'close';
    }
  } else if (isSelected) {
    containerBg = colors.surfaceTertiary || '#EAF4FF';
    borderColor = colors.primary || '#245BFF';
    textColor = colors.primary || '#245BFF';
    radioBg = colors.primary || '#245BFF';
    radioBorder = colors.primary || '#245BFF';
    iconName = 'checkmark';
  }

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={isSubmitted}
      onPress={() => onPress?.(option.id)}
      style={[
        styles.container,
        {
          backgroundColor: containerBg,
          borderColor,
          borderRadius: radii.large,
        },
      ]}
      accessibilityRole="radio"
      accessibilityState={{ checked: isSelected }}
      accessibilityLabel={option.text}
    >
      {/* Radio Circle */}
      <View
        style={[
          styles.radio,
          {
            backgroundColor: radioBg,
            borderColor: radioBorder,
          },
        ]}
      >
        {iconName ? (
          <Ionicons name={iconName} size={13} color={iconColor} />
        ) : null}
      </View>

      {/* Option Text */}
      <Text
        style={[
          typography.body,
          styles.text,
          {
            color: textColor,
            fontSize: scaleFont(14, 0.3),
            fontWeight: isSelected || (isSubmitted && (isCorrect || isUserSelection)) ? '700' : '500',
          },
        ]}
      >
        {option.text}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
    borderWidth: 1.5,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  text: {
    flex: 1,
    lineHeight: 20,
  },
});
