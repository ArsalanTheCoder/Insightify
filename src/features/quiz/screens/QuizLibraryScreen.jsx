/**
 * Insightify — QuizLibraryScreen (Quiz Feature Screen)
 *
 * All Quizzes list screen with compact difficulty filters and quiz cards.
 *
 * AGENTS.md & docs/RULES.md & RFC-005-F
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useResponsive } from '../../../shared/utils/responsive';
import ScreenContainer from '../../../shared/components/ScreenContainer';
import { useQuizList } from '../hooks/useQuizList';
import QuizCard from '../components/QuizCard';

export default function QuizLibraryScreen() {
  const navigation = useNavigation();
  const { colors, typography, radii } = useTheme();
  const insets = useSafeAreaInsets();
  const { scaleFont } = useResponsive();

  const {
    quizzes,
    selectedDifficulty,
    setSelectedDifficulty,
    difficulties,
  } = useQuizList('All');

  const handleQuizPress = (quiz) => {
    if (quiz.available === false) {
      Alert.alert(
        'Quiz Locked',
        `"${quiz.title}" is coming soon in a future update! Try Phishing Basics to test your knowledge now.`,
        [{ text: 'Got It' }]
      );
      return;
    }

    navigation.navigate('QuizStart', {
      quizId: quiz.id,
      quizTitle: quiz.title,
    });
  };

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('QuizDashboard');
    }
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
          onPress={handleBack}
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
          All Quizzes
        </Text>

        <View style={styles.filterIconBtn}>
          <Ionicons name="funnel-outline" size={20} color={colors.primary} />
        </View>
      </View>

      {/* 2. Compact Horizontal Difficulty Filter Pills */}
      <View style={styles.filterWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
          style={styles.filterScrollView}
        >
          {difficulties.map((diff) => {
            const isActive = selectedDifficulty === diff;
            return (
              <TouchableOpacity
                key={diff}
                activeOpacity={0.8}
                onPress={() => setSelectedDifficulty(diff)}
                style={[
                  styles.filterPill,
                  {
                    backgroundColor: isActive
                      ? colors.primary
                      : colors.surfaceSecondary,
                    borderRadius: radii.pill || 999,
                  },
                ]}
                accessibilityRole="button"
                accessibilityState={{ selected: isActive }}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    {
                      color: isActive ? '#FFFFFF' : colors.textSecondary,
                      fontWeight: isActive ? '800' : '600',
                      fontSize: scaleFont(12.5, 0.3),
                    },
                  ]}
                >
                  {diff}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* 3. Quiz Cards List */}
      <View style={styles.listContainer}>
        {quizzes.map((quiz) => (
          <QuizCard
            key={quiz.id}
            quiz={quiz}
            onPress={handleQuizPress}
          />
        ))}
      </View>
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
    marginBottom: 14,
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
  filterIconBtn: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterWrap: {
    marginBottom: 16,
  },
  filterScrollView: {
    flexGrow: 0,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 16,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterPillText: {
    letterSpacing: 0.1,
  },
  listContainer: {
    paddingBottom: 8,
  },
});
