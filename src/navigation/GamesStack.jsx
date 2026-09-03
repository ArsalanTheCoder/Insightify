/**
 * Insightify — GamesStack (Navigation Stack)
 *
 * Coordinates Quiz & Learning features under Tab 4 (Learn).
 *
 * Routes:
 * - QuizDashboard (Tab 4 Root)
 * - QuizLibrary
 * - QuizStart
 * - QuizRules
 * - QuizQuestion
 * - QuizCompleted
 * - QuizResults
 * - QuizReview
 *
 * AGENTS.md & docs/RULES.md & RFC-005-F
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import QuizDashboardScreen from '../features/quiz/screens/QuizDashboardScreen';
import QuizLibraryScreen from '../features/quiz/screens/QuizLibraryScreen';
import QuizStartScreen from '../features/quiz/screens/QuizStartScreen';
import QuizRulesScreen from '../features/quiz/screens/QuizRulesScreen';
import QuizQuestionScreen from '../features/quiz/screens/QuizQuestionScreen';
import QuizCompletedScreen from '../features/quiz/screens/QuizCompletedScreen';
import QuizResultsScreen from '../features/quiz/screens/QuizResultsScreen';
import QuizReviewScreen from '../features/quiz/screens/QuizReviewScreen';

const Stack = createNativeStackNavigator();

export default function GamesStack() {
  return (
    <Stack.Navigator
      initialRouteName="QuizDashboard"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="QuizDashboard" component={QuizDashboardScreen} />
      <Stack.Screen name="QuizLibrary" component={QuizLibraryScreen} />
      <Stack.Screen name="QuizStart" component={QuizStartScreen} />
      <Stack.Screen name="QuizRules" component={QuizRulesScreen} />
      <Stack.Screen name="QuizQuestion" component={QuizQuestionScreen} />
      <Stack.Screen name="QuizCompleted" component={QuizCompletedScreen} />
      <Stack.Screen name="QuizResults" component={QuizResultsScreen} />
      <Stack.Screen name="QuizReview" component={QuizReviewScreen} />
    </Stack.Navigator>
  );
}
