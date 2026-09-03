/**
 * Insightify — EditProfileScreen (Feature Screen)
 *
 * Edit profile screen:
 * Avatar change action, full name, username, bio inputs, and save changes.
 *
 * AGENTS.md & docs/RULES.md
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useResponsive } from '../../../shared/utils/responsive';
import { useProfile } from '../hooks/useProfile';
import { pickImage } from '../../detection/utils/mediaPicker';
import ScreenContainer from '../../../shared/components/ScreenContainer';
import Button from '../../../shared/components/Button';

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const { colors, typography, radii, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { scaleFont } = useResponsive();

  const { profile, updateProfile, isUpdating } = useProfile();

  const [name, setName] = useState(profile?.name || 'Muhammad Maaz');
  const [username, setUsername] = useState(profile?.username || 'maaz_dev');
  const [bio, setBio] = useState(profile?.bio || 'Fighting scams & making the internet safer 🚀');
  const [avatar, setAvatar] = useState(profile?.avatar);

  const handlePickAvatar = async () => {
    const picked = await pickImage();
    if (picked?.uri) {
      setAvatar({ uri: picked.uri });
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Full Name cannot be empty.');
      return;
    }

    try {
      await updateProfile({
        name: name.trim(),
        username: username.trim(),
        bio: bio.trim(),
        avatar,
      });
      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile.');
    }
  };

  const avatarSource =
    typeof avatar === 'number'
      ? avatar
      : avatar?.uri
      ? { uri: avatar.uri }
      : typeof avatar === 'string'
      ? { uri: avatar }
      : null;

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
          Edit Profile
        </Text>

        <View style={{ width: 38 }} />
      </View>

      {/* Avatar Section */}
      <View style={styles.avatarSection}>
        {avatarSource ? (
          <Image source={avatarSource} style={styles.avatar} resizeMode="cover" />
        ) : (
          <View style={[styles.avatarPlaceholder, { backgroundColor: colors.border }]}>
            <Text style={{ color: colors.textPrimary, fontSize: 32, fontWeight: '700' }}>
              {(name || 'U').charAt(0)}
            </Text>
          </View>
        )}

        <TouchableOpacity
          onPress={handlePickAvatar}
          activeOpacity={0.75}
          style={[styles.changePhotoBtn, { backgroundColor: isDark ? '#102038' : '#EEF4FF' }]}
          accessibilityRole="button"
          accessibilityLabel="Change profile photo"
        >
          <Ionicons name="camera-outline" size={16} color={colors.primary} style={{ marginRight: 6 }} />
          <Text style={[styles.changePhotoText, { color: colors.primary }]}>
            Change Photo
          </Text>
        </TouchableOpacity>
      </View>

      {/* Form Fields Card */}
      <View
        style={[
          styles.formCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: radii.large,
          },
        ]}
      >
        {/* Full Name */}
        <View style={styles.fieldGroup}>
          <Text style={[typography.body, styles.fieldLabel, { color: colors.textPrimary }]}>
            Full Name
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Enter your full name"
            placeholderTextColor={colors.textTertiary}
            style={[
              styles.input,
              {
                backgroundColor: isDark ? '#061329' : '#F8FAFC',
                borderColor: colors.border,
                color: colors.textPrimary,
                borderRadius: radii.medium,
              },
            ]}
          />
        </View>

        {/* Username */}
        <View style={styles.fieldGroup}>
          <Text style={[typography.body, styles.fieldLabel, { color: colors.textPrimary }]}>
            Username
          </Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="Enter username"
            placeholderTextColor={colors.textTertiary}
            style={[
              styles.input,
              {
                backgroundColor: isDark ? '#061329' : '#F8FAFC',
                borderColor: colors.border,
                color: colors.textPrimary,
                borderRadius: radii.medium,
              },
            ]}
          />
        </View>

        {/* Bio */}
        <View style={[styles.fieldGroup, { marginBottom: 0 }]}>
          <Text style={[typography.body, styles.fieldLabel, { color: colors.textPrimary }]}>
            Bio
          </Text>
          <TextInput
            value={bio}
            onChangeText={setBio}
            placeholder="Write something about yourself"
            placeholderTextColor={colors.textTertiary}
            multiline={true}
            style={[
              styles.input,
              styles.bioInput,
              {
                backgroundColor: isDark ? '#061329' : '#F8FAFC',
                borderColor: colors.border,
                color: colors.textPrimary,
                borderRadius: radii.medium,
              },
            ]}
            textAlignVertical="top"
          />
        </View>
      </View>

      {/* Save Changes CTA Button */}
      <Button
        title="Save Changes"
        onPress={handleSave}
        loading={isUpdating}
        style={styles.saveBtn}
      />
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
  avatarSection: {
    alignItems: 'center',
    marginVertical: 14,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: '#2563EB',
    marginBottom: 10,
  },
  avatarPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  changePhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  changePhotoText: {
    fontWeight: '700',
    fontSize: 13,
  },
  formCard: {
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontWeight: '700',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
  },
  bioInput: {
    minHeight: 80,
  },
  saveBtn: {
    width: '100%',
  },
});
