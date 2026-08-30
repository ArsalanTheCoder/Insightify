/**
 * Insightify — QuizRulesScreen (Quiz Feature Screen)
 *
 * Rules and instructions screen before starting the question session:
 * - Illustration (assets/quiz/quiz-rules.png)
 * - "Before You Start" heading
 * - 4 structured rules cards with icons
 * - "Got It, Let's Start!" gradient CTA
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
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useResponsive } from '../../../shared/utils/responsive';
import ScreenContainer from '../../../shared/components/ScreenContainer';

const QUIZ_RULES_IMAGE = require('../../../../assets/quiz/quiz-rules.png');

export default function QuizRulesScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { colors, typography, radii } = useTheme();
  const insets = useSafeAreaInsets();
  const { scaleFont, moderateScale } = useResponsive();

  const quizId = route.params?.quizId || 'phishing-basics';
  const quizTitle = route.params?.quizTitle || 'Phishing Basics';

  const handleStartQuestions = () => {
    navigation.navigate('QuizQuestion', {
      quizId,
      quizTitle,
      questionIndex: 0,
    });
  };

  const rules = [
    {
      id: 'r1',
      icon: 'help-circle-outline',
      text: 'Each question has one correct answer.',
    },
    {
      id: 'r2',
      icon: 'arrow-undo-outline',
      text: "You can't go back to a previous question.",
    },
    {
      id: 'r3',
      icon: 'document-text-outline',
      text: 'Answer all questions to see your results.',
    },
    {
      id: 'r4',
      icon: 'thumbs-up-outline',
      text: "Stay honest, you're learning for yourself!",
    },
  ];

  const bottomScrollPadding = (insets.bottom || 0) + 90;
  const imageSize = moderateScale(110);

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
          Quiz Rules
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      {/* 2. Illustration */}
      <View style={styles.imageContainer}>
        <Image
          source={QUIZ_RULES_IMAGE}
          style={{ width: imageSize, height: imageSize }}
          resizeMode="contain"
        />
      </View>

      {/* 3. Section Title */}
      <View style={styles.headingBlock}>
        <Text
          style={[
            typography.h1,
            styles.headingText,
            { color: colors.textPrimary, fontSize: scaleFont(22, 0.3) },
          ]}
        >
          Before You Start
        </Text>
        <Text
          style={[
            typography.body,
            styles.subtitleText,
            { color: colors.textSecondary, fontSize: scaleFont(13.5, 0.3) },
          ]}
        >
          Please read the rules carefully
        </Text>
      </View>

      {/* 4. Rules List */}
      <View style={styles.rulesList}>
        {rules.map((rule) => (
          <View
            key={rule.id}
            style={[
              styles.ruleCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderRadius: radii.large,
              },
            ]}
          >
            <View style={[styles.iconWrap, { backgroundColor: colors.surfaceSecondary, borderRadius: 10 }]}>
              <Ionicons name={rule.icon} size={20} color={colors.primary} />
            </View>
            <Text
              style={[
                typography.body,
                styles.ruleText,
                { color: colors.textPrimary, fontSize: scaleFont(13.5, 0.3) },
              ]}
            >
              {rule.text}
            </Text>
          </View>
        ))}
      </View>

      {/* 5. Got It CTA Button */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handleStartQuestions}
        style={styles.ctaBtnWrap}
        accessibilityRole="button"
        accessibilityLabel="Got It, Let's Start!"
      >
        <LinearGradient
          colors={['#245BFF', '#A63DFF']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={[styles.ctaBtn, { borderRadius: radii.large }]}
        >
          <Text
            style={[
              styles.ctaBtnText,
              { fontSize: scaleFont(15, 0.3) },
            ]}
          >
            Got It, Let's Start!
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
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 14,
  },
  headingBlock: {
    alignItems: 'center',
    marginBottom: 18,
  },
  headingText: {
    fontWeight: '900',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  subtitleText: {
    fontWeight: '500',
  },
  rulesList: {
    gap: 10,
    marginBottom: 24,
  },
  ruleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
  },
  iconWrap: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  ruleText: {
    flex: 1,
    lineHeight: 19,
    fontWeight: '600',
  },
  ctaBtnWrap: {
    width: '100%',
    elevation: 3,
    shadowColor: '#245BFF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  ctaBtn: {
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
