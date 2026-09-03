/**
 * Insightify — QuickActionTiles (Component)
 *
 * 5 multimodal Detection launchpad tiles on the Home Dashboard:
 * Scan Text, Scan Link, Scan Image, Scan File, Scan Audio.
 * Fully responsive across all Android device widths (prevents label truncation).
 *
 * docs/RFC/RFC-002-F-home-dashboard.md section 5.4
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

export default function QuickActionTiles({ onActionPress, style }) {
  const { colors, typography, radii, isDark } = useTheme();
  const { scaleFont, isSmallDevice } = useResponsive();

  const actions = [
    {
      id: 'text',
      label: 'Scan Text',
      iconName: 'chatbox-ellipses-outline',
      iconColor: '#7C3AED',
      bgColor: isDark ? '#1A1528' : '#F3F0FF',
    },
    {
      id: 'link',
      label: 'Scan Link',
      iconName: 'link-outline',
      iconColor: '#0284C7',
      bgColor: isDark ? '#102038' : '#EBF5FF',
    },
    {
      id: 'image',
      label: 'Scan Image',
      iconName: 'image-outline',
      iconColor: '#059669',
      bgColor: isDark ? '#102C1E' : '#E8F8F0',
    },
    {
      id: 'file',
      label: 'Scan File',
      iconName: 'document-text-outline',
      iconColor: '#EA580C',
      bgColor: isDark ? '#2D1E10' : '#FFF4EB',
    },
    {
      id: 'audio',
      label: 'Scan Audio',
      iconName: 'radio-outline',
      iconColor: '#E11D48',
      bgColor: isDark ? '#2D1010' : '#FFF0F0',
    },
  ];

  return (
    <View style={[styles.container, style]}>
      <Text style={[typography.h3, styles.sectionTitle, { color: colors.textPrimary, fontSize: scaleFont(16, 0.3) }]}>
        Quick Actions
      </Text>

      <View style={[styles.tilesRow, { gap: isSmallDevice ? 4 : 6 }]}>
        {actions.map((action) => (
          <TouchableOpacity
            key={action.id}
            activeOpacity={0.75}
            onPress={() => onActionPress && onActionPress(action.id)}
            style={styles.tileWrapper}
            accessibilityRole="button"
            accessibilityLabel={action.label}
          >
            {/* Rounded Icon Box */}
            <View
              style={[
                styles.iconBox,
                {
                  backgroundColor: action.bgColor,
                  borderRadius: radii.large,
                  borderColor: colors.border,
                },
              ]}
            >
              <Ionicons
                name={action.iconName}
                size={isSmallDevice ? 20 : 22}
                color={action.iconColor}
              />
            </View>

            {/* Label (Responsive & Multi-line Safe) */}
            <Text
              numberOfLines={2}
              style={[
                typography.caption,
                styles.tileLabel,
                {
                  color: colors.textSecondary,
                  fontSize: scaleFont(isSmallDevice ? 9.5 : 10.5, 0.3),
                },
              ]}
            >
              {action.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 22,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 10,
  },
  tilesRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  tileWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  iconBox: {
    width: '100%',
    aspectRatio: 1,
    maxWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
  },
  tileLabel: {
    lineHeight: 13,
    textAlign: 'center',
    fontWeight: '500',
    paddingHorizontal: 1,
  },
});
