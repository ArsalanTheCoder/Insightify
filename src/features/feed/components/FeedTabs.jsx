/**
 * Insightify — FeedTabs (Component)
 *
 * Horizontal 4-tab segmented pill bar:
 * ✨ For You | 🎵 Trending | 📍 Nearby | 🕒 Latest
 *
 * docs/RFC/RFC-003-F-feed-and-feed-detail.md section 5
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useResponsive } from '../../../shared/utils/responsive';

const TABS = [
  { id: 'for_you', label: 'For You', icon: 'sparkles' },
  { id: 'trending', label: 'Trending', icon: 'flame' },
  { id: 'nearby', label: 'Nearby', icon: 'location' },
  { id: 'latest', label: 'Latest', icon: 'time' },
];

export default function FeedTabs({
  activeTab = 'for_you',
  onTabChange,
  style,
}) {
  const { colors, typography, radii, gradients } = useTheme();
  const { scaleFont } = useResponsive();

  return (
    <View style={[styles.container, style]}>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;

          if (isActive) {
            return (
              <TouchableOpacity
                key={tab.id}
                activeOpacity={0.85}
                onPress={() => onTabChange && onTabChange(tab.id)}
                style={styles.tabWrapper}
                accessibilityRole="button"
                accessibilityLabel={`${tab.label} tab, active`}
              >
                <LinearGradient
                  colors={gradients.primaryCta.colors}
                  start={gradients.primaryCta.start}
                  end={gradients.primaryCta.end}
                  style={[styles.activePill, { borderRadius: radii.pill }]}
                >
                  <Ionicons
                    name={tab.icon}
                    size={14}
                    color="#FFFFFF"
                    style={styles.tabIcon}
                  />
                  <Text
                    style={[
                      typography.label,
                      styles.activeText,
                      { fontSize: scaleFont(12.5, 0.3) },
                    ]}
                  >
                    {tab.label}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={tab.id}
              activeOpacity={0.7}
              onPress={() => onTabChange && onTabChange(tab.id)}
              style={[
                styles.inactivePill,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderRadius: radii.pill,
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel={`${tab.label} tab`}
            >
              <Ionicons
                name={tab.icon}
                size={14}
                color={colors.textSecondary}
                style={styles.tabIcon}
              />
              <Text
                style={[
                  typography.label,
                  styles.inactiveText,
                  { color: colors.textSecondary, fontSize: scaleFont(12.5, 0.3) },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tabWrapper: {
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#245BFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  inactivePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
  },
  tabIcon: {
    marginRight: 5,
  },
  activeText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  inactiveText: {
    fontWeight: '500',
  },
});
