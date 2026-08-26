import React, { useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

const TAB_CONFIG = [
  { name: 'Feed', label: 'Feed', icon: 'newspaper', iconFilled: 'newspaper' },
  { name: 'Games', label: 'Quiz', icon: 'game-controller-outline', iconFilled: 'game-controller' },
  { name: 'Detect', label: 'Detect', icon: 'shield-checkmark-outline', iconFilled: 'shield-checkmark', isCenter: true },
  { name: 'Report', label: 'Report', icon: 'megaphone-outline', iconFilled: 'megaphone' },
  { name: 'Profile', label: 'Profile', icon: 'person-outline', iconFilled: 'person' },
];

export default function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.outerContainer}>
      {/* Floating bar */}
      <View style={styles.barContainer}>
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
            />
          );
        })}
      </View>
    </View>
  );
}

/* ─────────────── REGULAR TAB ─────────────── */

function RegularTab({ isFocused, label, icon, iconFilled, onPress }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const dotAnim = useRef(new Animated.Value(isFocused ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: isFocused ? 1.08 : 1,
        tension: 70,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(dotAnim, {
        toValue: isFocused ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isFocused, scaleAnim, dotAnim]);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={styles.tabBtn}
    >
      <Animated.View style={[styles.tabInner, { transform: [{ scale: scaleAnim }] }]}>
        <Ionicons
          name={isFocused ? iconFilled : icon}
          size={22}
          color={isFocused ? '#0056D2' : '#94A3B8'}
        />
        <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
          {label}
        </Text>

        {/* Active indicator dot */}
        <Animated.View
          style={[
            styles.activeDot,
            { opacity: dotAnim, transform: [{ scale: dotAnim }] },
          ]}
        />
      </Animated.View>
    </TouchableOpacity>
  );
}

/* ─────────────── CENTER (DETECT) TAB ─────────────── */

function CenterTab({ isFocused, label, icon, iconFilled, onPress }) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isFocused) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.12,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isFocused, pulseAnim]);

  useEffect(() => {
    Animated.spring(bounceAnim, {
      toValue: isFocused ? -4 : 0,
      tension: 60,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, [isFocused, bounceAnim]);

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={styles.centerTabBtn}
    >
      {/* Outer glow ring */}
      {isFocused && (
        <Animated.View
          style={[
            styles.glowRing,
            { transform: [{ scale: pulseAnim }] },
          ]}
        />
      )}

      {/* Main circular button */}
      <Animated.View style={[styles.centerCircleWrapper, { transform: [{ translateY: bounceAnim }] }]}>
        <LinearGradient
          colors={isFocused ? ['#0056D2', '#0284C7'] : ['#E2E8F0', '#CBD5E1']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.centerCircle}
        >
          <Ionicons
            name={isFocused ? iconFilled : icon}
            size={26}
            color={isFocused ? '#FFFFFF' : '#64748B'}
          />
        </LinearGradient>
      </Animated.View>

      <Text style={[styles.centerLabel, isFocused && styles.centerLabelActive]}>
        {label}
      </Text>
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
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    paddingHorizontal: 12,
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingTop: 8,
    paddingBottom: 6,
    paddingHorizontal: 6,
    width: width - 24,

    // Shadow
    elevation: 20,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.12,
    shadowRadius: 20,

    // Subtle top border
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.6)',
  },

  /* REGULAR TAB */
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  tabInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    marginTop: 3,
    letterSpacing: 0.2,
  },
  tabLabelActive: {
    color: '#0056D2',
    fontWeight: '800',
  },
  activeDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#0056D2',
    marginTop: 4,
  },

  /* CENTER TAB */
  centerTabBtn: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: -28,
    width: 72,
  },
  glowRing: {
    position: 'absolute',
    top: -2,
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: 'rgba(0, 86, 210, 0.1)',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 86, 210, 0.12)',
  },
  centerCircleWrapper: {
    elevation: 10,
    shadowColor: '#0056D2',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  centerCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  centerLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    marginTop: 5,
    letterSpacing: 0.2,
  },
  centerLabelActive: {
    color: '#0056D2',
    fontWeight: '800',
  },
});
