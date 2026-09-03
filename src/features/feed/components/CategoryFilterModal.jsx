/**
 * Insightify — CategoryFilterModal (Component)
 *
 * Bottom sheet modal for selecting threat feed categories:
 * All Threats | Banking | Phishing | Voice AI | Deepfake | Job & Fraud
 *
 * docs/RFC/RFC-003-F-feed-and-feed-detail.md section 5
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useResponsive } from '../../../shared/utils/responsive';

const CATEGORIES = [
  { id: 'all', label: 'All Threats', icon: 'shield-outline' },
  { id: 'banking', label: 'Banking & SMS Scams', icon: 'card-outline' },
  { id: 'phishing', label: 'Phishing & Fake Ads', icon: 'link-outline' },
  { id: 'voice ai', label: 'AI Voice Cloning', icon: 'mic-outline' },
  { id: 'deepfake', label: 'Deepfake Videos', icon: 'videocam-outline' },
  { id: 'fraud', label: 'Job & Advance-Fee Fraud', icon: 'briefcase-outline' },
];

export default function CategoryFilterModal({
  visible = false,
  selectedCategory = 'all',
  onSelectCategory,
  onClose,
}) {
  const { colors, typography, radii } = useTheme();
  const { scaleFont, insets } = useResponsive();

  const handleSelect = (categoryId) => {
    onSelectCategory && onSelectCategory(categoryId);
    onClose && onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.sheetContainer,
                {
                  backgroundColor: colors.surface,
                  borderTopLeftRadius: radii.xl,
                  borderTopRightRadius: radii.xl,
                  borderColor: colors.border,
                  paddingBottom: Math.max(insets.bottom, 20),
                },
              ]}
            >
              {/* Handle Bar */}
              <View style={[styles.handleBar, { backgroundColor: colors.border }]} />

              {/* Title */}
              <View style={styles.headerRow}>
                <Text style={[typography.h3, styles.title, { color: colors.textPrimary, fontSize: scaleFont(17, 0.3) }]}>
                  Filter Threats by Category
                </Text>
                <TouchableOpacity
                  onPress={onClose}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="close-circle" size={24} color={colors.textTertiary} />
                </TouchableOpacity>
              </View>

              {/* Category List */}
              <View style={styles.listContainer}>
                {CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory.toLowerCase() === cat.id.toLowerCase();

                  return (
                    <TouchableOpacity
                      key={cat.id}
                      activeOpacity={0.7}
                      onPress={() => handleSelect(cat.id)}
                      style={[
                        styles.categoryItem,
                        isSelected && {
                          backgroundColor: colors.primarySoft,
                          borderRadius: radii.large,
                        },
                      ]}
                    >
                      <View style={styles.itemLeft}>
                        <Ionicons
                          name={cat.icon}
                          size={20}
                          color={isSelected ? colors.primary : colors.textSecondary}
                          style={styles.itemIcon}
                        />
                        <Text
                          style={[
                            typography.body,
                            styles.itemLabel,
                            {
                              color: isSelected ? colors.primary : colors.textPrimary,
                              fontWeight: isSelected ? '700' : '500',
                            },
                          ]}
                        >
                          {cat.label}
                        </Text>
                      </View>

                      {isSelected ? (
                        <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                      ) : null}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    paddingTop: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontWeight: '700',
  },
  listContainer: {
    paddingBottom: 8,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIcon: {
    marginRight: 12,
  },
  itemLabel: {
    fontSize: 15,
  },
});
