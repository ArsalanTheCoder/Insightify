/**
 * Insightify — EvidenceGallerySection (Component)
 *
 * Section 2: "Evidence" on Threat Detail screen.
 * Extended, full-width side-by-side evidence screenshot cards with "Image X of Y" captions
 * and a full-screen zoom preview modal.
 *
 * docs/RFC/RFC-003-F-feed-and-feed-detail.md section 6
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useResponsive } from '../../../shared/utils/responsive';

export default function EvidenceGallerySection({
  evidence = [],
  style,
}) {
  const { colors, typography, radii, isDark } = useTheme();
  const { scaleFont, isSmallDevice } = useResponsive();
  const [selectedImage, setSelectedImage] = useState(null);

  if (!evidence || evidence.length === 0) {
    return null;
  }

  const iconBg = isDark ? '#1C223A' : '#EEF2FF';

  return (
    <View style={[styles.container, style]}>
      {/* Header Row: Circle Icon + Section Title */}
      <View style={styles.headerRow}>
        <View style={[styles.circleIcon, { backgroundColor: iconBg }]}>
          <Ionicons name="image-outline" size={16} color={colors.primary} />
        </View>
        <Text style={[typography.h3, styles.heading, { color: colors.textPrimary, fontSize: scaleFont(16, 0.3) }]}>
          Evidence
        </Text>
      </View>

      {/* Full-width extended side-by-side evidence cards */}
      <View style={[styles.evidenceGrid, { gap: isSmallDevice ? 10 : 14 }]}>
        {evidence.map((item, index) => (
          <View key={item.id || index} style={styles.cardCol}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setSelectedImage(item.uri)}
              style={[
                styles.evidenceCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderRadius: radii.large,
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel={`Evidence image ${index + 1} of ${evidence.length}`}
            >
              <Image
                source={item.uri}
                style={styles.evidenceImage}
                resizeMode="cover"
                fadeDuration={0}
              />
            </TouchableOpacity>

            {/* Caption underneath */}
            <Text style={[styles.captionText, { color: colors.textTertiary }]}>
              Image {index + 1} of {evidence.length}
            </Text>
          </View>
        ))}
      </View>

      {/* Full-Screen Zoom Modal */}
      <Modal
        visible={!!selectedImage}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedImage(null)}
      >
        <TouchableWithoutFeedback onPress={() => setSelectedImage(null)}>
          <View style={styles.modalBackdrop}>
            <TouchableOpacity
              onPress={() => setSelectedImage(null)}
              style={styles.closeBtn}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Ionicons name="close" size={28} color="#FFFFFF" />
            </TouchableOpacity>

            {selectedImage ? (
              <TouchableWithoutFeedback>
                <Image
                  source={selectedImage}
                  style={styles.fullScreenImage}
                  resizeMode="contain"
                />
              </TouchableWithoutFeedback>
            ) : null}
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  circleIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  heading: {
    fontWeight: '700',
  },
  evidenceGrid: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
  },
  cardCol: {
    flex: 1,
    alignItems: 'center',
  },
  evidenceCard: {
    width: '100%',
    height: 175,
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  evidenceImage: {
    width: '100%',
    height: '100%',
  },
  captionText: {
    fontSize: 11.5,
    fontWeight: '500',
    marginTop: 6,
    textAlign: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 44,
    right: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreenImage: {
    width: '92%',
    height: '80%',
  },
});
