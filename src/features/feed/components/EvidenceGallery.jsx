/**
 * Insightify — EvidenceGallery (Component)
 *
 * Evidence screenshots gallery supporting 0, 1, 2, or 3+ images with a "+N More" overlay tile
 * and a full-screen image preview modal.
 *
 * docs/RFC/RFC-003-F-feed-and-feed-detail.md section 6 & section 8
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

export default function EvidenceGallery({
  evidence = [],
  style,
}) {
  const { colors, typography, radii } = useTheme();
  const { scaleFont } = useResponsive();
  const [selectedImage, setSelectedImage] = useState(null);

  if (!evidence || evidence.length === 0) {
    return null;
  }

  const displayedEvidence = evidence.slice(0, 3);
  const remainingCount = evidence.length > 3 ? evidence.length - 2 : 0;

  return (
    <View style={[styles.container, style]}>
      <Text style={[typography.h3, styles.sectionTitle, { color: colors.textPrimary, fontSize: scaleFont(16, 0.3) }]}>
        Evidence
      </Text>

      <View style={styles.galleryRow}>
        {displayedEvidence.map((item, index) => {
          const isLastOverlay = index === 2 && remainingCount > 0;

          return (
            <TouchableOpacity
              key={item.id || index}
              activeOpacity={0.8}
              onPress={() => setSelectedImage(item.uri)}
              style={[
                styles.thumbnailCard,
                {
                  backgroundColor: colors.surfaceSecondary,
                  borderColor: colors.border,
                  borderRadius: radii.large,
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel={`Evidence item ${index + 1}`}
            >
              <Image
                source={item.uri}
                style={styles.thumbnailImage}
                resizeMode="cover"
                fadeDuration={0}
              />

              {/* +N More Overlay */}
              {isLastOverlay ? (
                <View style={styles.moreOverlay}>
                  <Text style={styles.moreText}>+{remainingCount} More</Text>
                </View>
              ) : null}
            </TouchableOpacity>
          );
        })}
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
    marginBottom: 22,
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: 10,
  },
  galleryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  thumbnailCard: {
    flex: 1,
    height: 90,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  moreOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
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
