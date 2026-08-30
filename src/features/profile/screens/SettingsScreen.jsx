/**
 * Insightify — SettingsScreen (Feature Screen)
 *
 * Settings and preferences screen:
 * Account info, Privacy & Security, Notifications, App Experience, Support & Legal, and Logout.
 *
 * AGENTS.md & docs/RULES.md
 */

import React, { useContext } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../../../context/AuthContext';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useResponsive } from '../../../shared/utils/responsive';
import { useProfile } from '../hooks/useProfile';
import { useSettings } from '../hooks/useSettings';
import ScreenContainer from '../../../shared/components/ScreenContainer';
import SettingToggleRow from '../components/SettingToggleRow';
import SettingLinkRow from '../components/SettingLinkRow';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { colors, typography, radii, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { scaleFont } = useResponsive();

  const { logout } = useContext(AuthContext);
  const { profile } = useProfile();
  const { settings, toggle } = useSettings();

  const avatarSource =
    typeof profile?.avatar === 'number'
      ? profile.avatar
      : profile?.avatar?.uri
      ? { uri: profile.avatar.uri }
      : typeof profile?.avatar === 'string'
      ? { uri: profile.avatar }
      : null;

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out of Insightify?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            if (logout) {
              await logout();
            }
          },
        },
      ]
    );
  };

  const bottomScrollPadding = (insets.bottom || 8) + 95;

  return (
    <ScreenContainer
      scrollable={true}
      withPadding={true}
      contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomScrollPadding }]}
      style={styles.container}
    >
      {/* Top Header Row */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          style={[styles.backBtn, { backgroundColor: isDark ? '#102038' : '#EEF4FF' }]}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={22} color={colors.primary} />
        </TouchableOpacity>

        <Text style={[typography.h2, styles.headerTitle, { color: colors.textPrimary, fontSize: scaleFont(20, 0.3) }]}>
          Settings
        </Text>

        <View style={{ width: 38 }} />
      </View>

      {/* 1. Account Section Card */}
      <View
        style={[
          styles.sectionCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: radii.large,
          },
        ]}
      >
        <Text style={[typography.h3, styles.sectionTitle, { color: colors.textPrimary }]}>
          Account
        </Text>

        <View style={styles.accountRow}>
          {avatarSource ? (
            <Image source={avatarSource} style={styles.avatar} resizeMode="cover" />
          ) : (
            <View style={[styles.avatarPlaceholder, { backgroundColor: colors.border }]}>
              <Text style={{ color: colors.textPrimary, fontWeight: '700' }}>
                {(profile?.name || 'U').charAt(0)}
              </Text>
            </View>
          )}

          <View style={styles.accountInfo}>
            <Text style={[typography.h3, styles.accountName, { color: colors.textPrimary }]}>
              {profile?.name || 'Muhammad Maaz'}
            </Text>
            <Text style={[typography.caption, { color: colors.textSecondary }]}>
              {profile?.username ? `@${profile.username}` : 'mohammad.maaz@gmail.com'}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('EditProfile')}
            activeOpacity={0.7}
            style={[styles.editBtn, { backgroundColor: isDark ? '#102038' : '#EEF4FF' }]}
            accessibilityRole="button"
            accessibilityLabel="Edit profile details"
          >
            <Ionicons name="create-outline" size={18} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. Privacy & Security Card */}
      <View
        style={[
          styles.sectionCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: radii.large,
          },
        ]}
      >
        <Text style={[typography.h3, styles.sectionTitle, { color: colors.textPrimary }]}>
          Privacy & Security
        </Text>

        <SettingToggleRow
          icon="eye-outline"
          title="Public Profile"
          value={settings.profilePublic}
          onToggle={() => toggle('profilePublic')}
        />

        <SettingToggleRow
          icon="trophy-outline"
          title="Show on Leaderboard"
          value={settings.showOnLeaderboard}
          onToggle={() => toggle('showOnLeaderboard')}
        />

        <SettingToggleRow
          icon="shield-checkmark-outline"
          title="Anonymous Reports"
          value={settings.anonymousReports}
          onToggle={() => toggle('anonymousReports')}
        />
      </View>

      {/* 3. Notifications Card */}
      <View
        style={[
          styles.sectionCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: radii.large,
          },
        ]}
      >
        <Text style={[typography.h3, styles.sectionTitle, { color: colors.textPrimary }]}>
          Notifications
        </Text>

        <SettingToggleRow
          icon="notifications-outline"
          title="Enable Notifications"
          value={settings.notificationsEnabled}
          onToggle={() => toggle('notificationsEnabled')}
        />

        <SettingToggleRow
          icon="alert-circle-outline"
          title="Scam Alerts"
          value={settings.scamAlerts}
          onToggle={() => toggle('scamAlerts')}
        />

        <SettingToggleRow
          icon="medal-outline"
          title="Achievements"
          value={settings.achievements}
          onToggle={() => toggle('achievements')}
        />

        <SettingToggleRow
          icon="stats-chart-outline"
          title="Leaderboard Updates"
          value={settings.leaderboardUpdates}
          onToggle={() => toggle('leaderboardUpdates')}
        />
      </View>

      {/* 4. App Experience Card */}
      <View
        style={[
          styles.sectionCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: radii.large,
          },
        ]}
      >
        <Text style={[typography.h3, styles.sectionTitle, { color: colors.textPrimary }]}>
          App Experience
        </Text>

        <SettingToggleRow
          icon="moon-outline"
          title="Dark Mode"
          value={settings.darkMode}
          onToggle={() => toggle('darkMode')}
        />

        <SettingToggleRow
          icon="cellular-outline"
          title="Low Data Mode"
          value={settings.lowDataMode}
          onToggle={() => toggle('lowDataMode')}
        />
      </View>

      {/* 5. Support & Legal Card */}
      <View
        style={[
          styles.sectionCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: radii.large,
          },
        ]}
      >
        <Text style={[typography.h3, styles.sectionTitle, { color: colors.textPrimary }]}>
          Support & Legal
        </Text>

        <SettingLinkRow
          icon="help-circle-outline"
          title="Help & FAQs"
          onPress={() => Alert.alert('Help & FAQs', 'Visit insightify.app/help for FAQs.')}
        />

        <SettingLinkRow
          icon="mail-outline"
          title="Contact Support"
          onPress={() => Alert.alert('Support', 'Contact us at support@insightify.app')}
        />

        <SettingLinkRow
          icon="document-text-outline"
          title="Privacy Policy"
          onPress={() => Alert.alert('Privacy Policy', 'Review privacy at insightify.app/privacy')}
        />

        <SettingLinkRow
          icon="information-circle-outline"
          title="About Insightify"
          onPress={() => Alert.alert('About Insightify', 'Insightify v1.0.0 — Mobile Cyber Companion')}
        />
      </View>

      {/* 6. Logout Card */}
      <TouchableOpacity
        onPress={handleLogout}
        activeOpacity={0.8}
        style={[
          styles.logoutCard,
          {
            backgroundColor: isDark ? '#2D1218' : '#FFF5F5',
            borderColor: isDark ? '#4C1D24' : '#FEE2E2',
            borderRadius: radii.large,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Log out of Insightify"
      >
        <Ionicons name="log-out-outline" size={20} color="#EF4444" style={{ marginRight: 10 }} />
        <Text style={[typography.button, styles.logoutText, { color: '#EF4444' }]}>
          Log Out
        </Text>
      </TouchableOpacity>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    marginBottom: 12,
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
  },
  sectionCard: {
    borderWidth: 1,
    padding: 14,
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontWeight: '800',
    marginBottom: 10,
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontWeight: '700',
    marginBottom: 2,
  },
  editBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderWidth: 1,
    marginTop: 6,
    marginBottom: 20,
  },
  logoutText: {
    fontWeight: '800',
  },
});
