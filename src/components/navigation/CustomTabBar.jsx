/**
 * Insightify — CustomTabBar (Component)
 *
 * 5-tab floating bottom navigation matching the approved UI reference:
 * Home | Feed | Detect (Center Elevated Floating Shield) | Learn | Profile
 * Translucent glass surface, Safe-Area aware across all Android versions
 * (3-button navigation bar, gesture navigation, and notches).
 *
 * docs/RFC/RFC-002-F-home-dashboard.md section 7
 */

import React, { useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../shared/hooks/useTheme';
import { useResponsive } from '../../shared/utils/responsive';

const TAB_CONFIG = [
  { name: 'Home', label: 'Home', icon: 'home-outline', iconFilled: 'home' },
  { name: 'Feed', label: 'Feed', icon: 'newspaper-outline', iconFilled: 'newspaper' },
  { name: 'Detect', label: 'Detect', icon: 'shield-checkmark-outline', iconFilled: 'shield-checkmark', isCenter: true },
  { name: 'Learn', label: 'Learn', icon: 'book-outline', iconFilled: 'book' },
  { name: 'Profile', label: 'Profile', icon: 'person-outline', iconFilled: 'person' },
];

export default function CustomTabBar({ state, descriptors, navigation }) {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { width, scaleFont, isSmallDevice } = useResponsive();

  const barBg = isDark
    ? 'rgba(13, 29, 54, 0.95)'
    : 'rgba(255, 255, 255, 0.96)';
  const barBorder = isDark
    ? 'rgba(33, 54, 82, 0.85)'
    : 'rgba(221, 230, 242, 0.85)';

  // Safe area bottom inset calculation for Android system nav bar & iOS home indicator
  const bottomInset = Platform.OS === 'ios'
    ? Math.max(insets.bottom, 16)
    : Math.max(insets.bottom, 8);

  const barWidth = width > 420 ? 390 : width - (isSmallDevice ? 20 : 28);

  return (
    <View
      style={[styles.outerContainer, { paddingBottom: bottomInset }]}
      pointerEvents="box-none"
    >
      {/* Subtle Translucent Floating Bar Container */}
      <View
        style={[
          styles.barContainer,
          {
            width: barWidth,
            backgroundColor: barBg,
            borderColor: barBorder,
            shadowColor: isDark ? '#000000' : '#0F172A',
          },
        ]}
      >
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const tabConfig = TAB_CONFIG[index];

          if (!tabConfig) {
            return null;
          }

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          if (tabConfig.isCenter) {
            return (
              <CenterTab
                key={route.key}
                isFocused={isFocused}
                label={tabConfig.label}
                icon={tabConfig.icon}
                iconFilled={tabConfig.iconFilled}
                onPress={onPress}
                isSmallDevice={isSmallDevice}
              />
            );
          }

          return (
            <RegularTab
              key={route.key}
              isFocused={isFocused}
              label={tabConfig.label}
              icon={tabConfig.icon}
              iconFilled={tabConfig.iconFilled}
              onPress={onPress}
              scaleFont={scaleFont}
              isSmallDevice={isSmallDevice}
            />
          );
        })}
      </View>
    </View>
  );
}

/* ─────────────── REGULAR TAB ─────────────── */

function RegularTab({ isFocused, label, icon, iconFilled, onPress, scaleFont, isSmallDevice }) {
  const { colors, isDark } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isFocused ? 1.05 : 1,
      tension: 70,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [isFocused, scaleAnim]);

  const activeBg = isDark ? '#102038' : '#EEF4FF';
  const activeColor = colors.primary;
  const inactiveColor = colors.textTertiary;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={styles.tabBtn}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: isFocused }}
    >
      <Animated.View style={[styles.tabInner, { transform: [{ scale: scaleAnim }] }]}>
        {/* Soft rounded active pill indicator */}
        <View style={[styles.iconWrapper, isFocused && { backgroundColor: activeBg }]}>
          <Ionicons
            name={isFocused ? iconFilled : icon}
            size={isSmallDevice ? 19 : 21}
            color={isFocused ? activeColor : inactiveColor}
          />
        </View>

        <Text
          numberOfLines={1}
          style={[
            styles.tabLabel,
            {
              color: isFocused ? activeColor : inactiveColor,
              fontSize: scaleFont(isSmallDevice ? 9.5 : 10.5, 0.3),
            },
            isFocused && styles.tabLabelActive,
          ]}
        >
          {label}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

/* ─────────────── CENTER (DETECT) FLOATING TAB ─────────────── */

function CenterTab({ isFocused, onPress, isSmallDevice }) {
  const { gradients } = useTheme();
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(bounceAnim, {
      toValue: isFocused ? -2 : 0,
      tension: 60,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, [isFocused, bounceAnim]);

  const circleSize = isSmallDevice ? 50 : 54;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={styles.centerTabBtn}
      accessibilityRole="button"
      accessibilityLabel="Detect scanner"
      accessibilityState={{ selected: isFocused }}
    >
      <Animated.View
        style={[
          styles.centerCircleWrapper,
          {
            width: circleSize + 4,
            height: circleSize + 4,
            borderRadius: (circleSize + 4) / 2,
            transform: [{ translateY: bounceAnim }],
          },
        ]}
      >
        <LinearGradient
          colors={gradients.primaryCta.colors}
          start={gradients.primaryCta.start}
          end={gradients.primaryCta.end}
          style={[
            styles.centerCircle,
            {
              width: circleSize,
              height: circleSize,
              borderRadius: circleSize / 2,
            },
          ]}
        >
          <Ionicons
            name="shield-checkmark"
            size={isSmallDevice ? 23 : 25}
            color="#FFFFFF"
          />
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
}

/* ─────────────── STYLES ─────────────── */

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 28,
    paddingTop: 6,
    paddingBottom: 6,
    paddingHorizontal: 4,
    elevation: 16,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    borderWidth: 1,
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  tabInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    width: 36,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  tabLabel: {
    fontWeight: '500',
    lineHeight: 13,
  },
  tabLabelActive: {
    fontWeight: '700',
  },
  centerTabBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    top: -12, // Floating elevation above bar
  },
  centerCircleWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    shadowColor: '#245BFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },
  centerCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
