/**
 * Insightify — ScanInputCard (Component)
 *
 * Dedicated input area for all 5 scan modes:
 * - Text & Email: Multiline text input with live 0/5000 character counter (clean borderless layout).
 * - Image, Video & Audio: Interactive tap-to-pick zone and local media preview state.
 *
 * docs/RFC/RFC-004-F-detection-and-scan-history.md section 5
 */

import React from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useResponsive } from '../../../shared/utils/responsive';

export default function ScanInputCard({
  activeMode = 'text',
  value = '',
  onChangeText,
  attachment = null,
  onPickMedia,
  onRemoveAttachment,
  error = null,
  style,
}) {
  const { colors, typography, radii, isDark } = useTheme();
  const { scaleFont } = useResponsive();

  const isTextBased = activeMode === 'text' || activeMode === 'email';

  const placeholders = {
    text: 'Paste or type the suspicious message, URL, or content here...',
    email: 'Paste email headers, sender address, or message body here...',
  };

  const mediaConfig = {
    image: {
      title: 'Tap to select an Image',
      subtitle: 'Screenshots, photos, or documents (PNG, JPG)',
      icon: 'image-outline',
      iconColor: '#059669',
      bgLight: '#E8F8F0',
      bgDark: '#102C1E',
    },
    video: {
      title: 'Tap to select a Video',
      subtitle: 'Clips, screen recordings, or deepfake samples (MP4, MOV)',
      icon: 'videocam-outline',
      iconColor: '#E11D48',
      bgLight: '#FFF0F0',
      bgDark: '#2D1010',
    },
    audio: {
      title: 'Tap to select an Audio file',
      subtitle: 'Voice notes, calls, or cloned audio (M4A, MP3, WAV)',
      icon: 'mic-outline',
      iconColor: '#EA580C',
      bgLight: '#FFF4EB',
      bgDark: '#2D1E10',
    },
  };

  const currentMedia = mediaConfig[activeMode] || mediaConfig.image;

  return (
    <View style={[styles.container, style]}>
      {/* Section Title */}
      <Text style={[typography.h3, styles.sectionTitle, { color: colors.textPrimary, fontSize: scaleFont(15, 0.3) }]}>
        Enter Content to Analyze
      </Text>

      {/* Input Card Body */}
      {isTextBased ? (
        /* Text & Email Input Card */
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderColor: error ? colors.danger : colors.border,
              borderRadius: radii.large,
            },
          ]}
        >
          <TextInput
            multiline={true}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholders[activeMode]}
            placeholderTextColor={colors.textTertiary}
            style={[
              styles.textInput,
              {
                color: colors.textPrimary,
                fontSize: scaleFont(14, 0.3),
              },
            ]}
            textAlignVertical="top"
            maxLength={5000}
          />

          {/* Dynamic 0/5000 Character Counter (clean, no top divider line) */}
          <View style={styles.counterRow}>
            <Text style={[typography.caption, styles.counterText, { color: colors.textTertiary, fontSize: scaleFont(11.5, 0.3) }]}>
              {value.length}/5000
            </Text>
          </View>
        </View>
      ) : (
        /* Media & Document (Image / Video / Audio) Input Card */
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderColor: error ? colors.danger : colors.border,
              borderRadius: radii.large,
            },
          ]}
        >
          {attachment ? (
            /* Selected File Preview State */
            <View style={styles.previewContainer}>
              {activeMode === 'image' && attachment.uri ? (
                /* Image Preview Thumbnail */
                <View style={styles.imagePreviewWrapper}>
                  <Image
                    source={{ uri: attachment.uri }}
                    style={styles.imageThumbnail}
                    resizeMode="cover"
                  />
                </View>
              ) : (
                /* Video / Audio Media Box */
                <View style={[styles.mediaIconBox, { backgroundColor: isDark ? currentMedia.bgDark : currentMedia.bgLight }]}>
                  <Ionicons name={currentMedia.icon} size={28} color={currentMedia.iconColor} />
                </View>
              )}

              {/* File Info */}
              <View style={styles.fileInfoCol}>
                <Text numberOfLines={1} style={[typography.h3, styles.fileName, { color: colors.textPrimary }]}>
                  {attachment.name}
                </Text>
                <Text style={[typography.caption, { color: colors.textSecondary }]}>
                  {attachment.size || 'Local media'} • {activeMode.toUpperCase()}
                </Text>
              </View>

              {/* Actions: Change & Remove */}
              <View style={styles.actionRow}>
                <TouchableOpacity
                  onPress={onPickMedia}
                  activeOpacity={0.7}
                  style={[styles.changeBtn, { backgroundColor: isDark ? '#102038' : '#EEF4FF' }]}
                  accessibilityRole="button"
                  accessibilityLabel="Change selected media"
                >
                  <Ionicons name="refresh" size={14} color={colors.primary} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={onRemoveAttachment}
                  activeOpacity={0.7}
                  style={[styles.removeBtn, { backgroundColor: isDark ? '#2D1218' : '#FEE2E2' }]}
                  accessibilityRole="button"
                  accessibilityLabel="Remove selected media"
                >
                  <Ionicons name="trash-outline" size={14} color={colors.danger} />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            /* Tap-To-Pick Dropzone */
            <TouchableOpacity
              onPress={onPickMedia}
              activeOpacity={0.75}
              style={[styles.dropzone, { backgroundColor: isDark ? currentMedia.bgDark : currentMedia.bgLight }]}
              accessibilityRole="button"
              accessibilityLabel={currentMedia.title}
            >
              <View style={[styles.dropzoneIconCircle, { backgroundColor: colors.surface }]}>
                <Ionicons name={currentMedia.icon} size={24} color={currentMedia.iconColor} />
              </View>

              <Text style={[typography.h3, styles.dropzoneTitle, { color: colors.textPrimary, fontSize: scaleFont(14.5, 0.3) }]}>
                {currentMedia.title}
              </Text>

              <Text style={[typography.caption, styles.dropzoneSubtitle, { color: colors.textSecondary, fontSize: scaleFont(12, 0.3) }]}>
                {currentMedia.subtitle}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Validation Error Banner */}
      {error ? (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle" size={14} color={colors.danger} style={{ marginRight: 4 }} />
          <Text style={[typography.caption, { color: colors.danger }]}>
            {error}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: 10,
  },
  card: {
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 10,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    minHeight: 140,
    justifyContent: 'space-between',
  },
  textInput: {
    minHeight: 100,
    maxHeight: 160,
    padding: 0,
    lineHeight: 21,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 4,
    paddingBottom: 2,
  },
  counterText: {
    fontWeight: '600',
  },
  dropzone: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 22,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    borderStyle: 'dashed',
  },
  dropzoneIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  dropzoneTitle: {
    fontWeight: '700',
    marginBottom: 2,
    textAlign: 'center',
  },
  dropzoneSubtitle: {
    textAlign: 'center',
  },
  previewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  imagePreviewWrapper: {
    width: 56,
    height: 56,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    marginRight: 12,
  },
  imageThumbnail: {
    width: '100%',
    height: '100%',
  },
  mediaIconBox: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  fileInfoCol: {
    flex: 1,
    paddingRight: 8,
  },
  fileName: {
    fontWeight: '700',
    fontSize: 13.5,
    marginBottom: 2,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  changeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    paddingHorizontal: 4,
  },
});
