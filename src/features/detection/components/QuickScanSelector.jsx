/**
 * Insightify — QuickScanSelector (Component)
 *
 * 5 Multimodal scan mode buttons on Detect screen:
 * Text | Email | Image | Video | Audio
 *
 * docs/RFC/RFC-004-F-detection-and-scan-history.md section 5
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useResponsive } from '../../../shared/utils/responsive';

const SCAN_MODES = [
  {
    id: 'text',
    label: 'Text',
    iconName: 'chatbox-ellipses',
    color: '#0284C7',
    bgColorLight: '#EBF5FF',
    bgColorDark: '#102038',
  },
  {
    id: 'email',
    label: 'Email',
    iconName: 'mail',
    color: '#7C3AED',
    bgColorLight: '#F3F0FF',
    bgColorDark: '#1A1528',
  },
  {
    id: 'image',
    label: 'Image',
    iconName: 'image',
    color: '#059669',
    bgColorLight: '#E8F8F0',
    bgColorDark: '#102C1E',
  },
  {
    id: 'video',
    label: 'Video',
    iconName: 'videocam',
    color: '#E11D48',
    bgColorLight: '#FFF0F0',
    bgColorDark: '#2D1010',
  },
  {
    id: 'audio',
    label: 'Audio',
    iconName: 'mic',
    color: '#EA580C',
    bgColorLight: '#FFF4EB',
    bgColorDark: '#2D1E10',
  },
];

export default function QuickScanSelector({
  activeMode = 'text',
  onSelectMode,
  style,
}) {
  const { colors, typography, radii, isDark } = useTheme();
  const { scaleFont, isSmallDevice } = useResponsive();

  return (
    <View style={[styles.container, style]}>
      <Text style={[typography.h3, styles.sectionTitle, { color: colors.textPrimary, fontSize: scaleFont(15, 0.3) }]}>
        Quick Scan
      </Text>

      <View style={[styles.row, { gap: isSmallDevice ? 5 : 8 }]}>
        {SCAN_MODES.map((mode) => {
          const isActive = activeMode === mode.id;
          const bg = isDark ? mode.bgColorDark : mode.bgColorLight;

          return (
            <TouchableOpacity
              key={mode.id}
              activeOpacity={0.75}
              onPress={() => onSelectMode && onSelectMode(mode.id)}
              style={styles.tileCol}
              accessibilityRole="button"
              accessibilityLabel={`${mode.label} scan mode, ${isActive ? 'selected' : 'unselected'}`}
            >
              {/* Rounded Icon Box */}
              <View
                style={[
                  styles.iconBox,
                  {
                    backgroundColor: bg,
                    borderColor: isActive ? mode.color : colors.border,
                    borderWidth: isActive ? 2 : 1,
                    borderRadius: radii.large,
                  },
                ]}
              >
                <Ionicons
                  name={mode.iconName}
                  size={isSmallDevice ? 19 : 21}
                  color={mode.color}
                />
              </View>

              {/* Label */}
              <Text
                style={[
                  typography.caption,
                  styles.tileLabel,
                  {
                    color: isActive ? colors.textPrimary : colors.textSecondary,
                    fontWeight: isActive ? '700' : '500',
                    fontSize: scaleFont(isSmallDevice ? 10.5 : 11.5, 0.3),
                  },
                ]}
              >
                {mode.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tileCol: {
    flex: 1,
    alignItems: 'center',
  },
  iconBox: {
    width: '100%',
    aspectRatio: 1,
    maxWidth: 58,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    elevation: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
  },
  tileLabel: {
    textAlign: 'center',
  },
});
