/**
 * Insightify — Media & Document Picker Utility
 *
 * Provides native file & media picking for Image, Video, and Audio scanning modes
 * using react-native-image-picker and react-native-document-picker.
 *
 * docs/RFC/RFC-004-F-detection-and-scan-history.md
 */

import { launchImageLibrary } from 'react-native-image-picker';
import DocumentPicker, { isCancel, types } from 'react-native-document-picker';

/**
 * Format bytes to readable size (e.g. 2.4 MB)
 */
export function formatFileSize(bytes) {
  if (!bytes || bytes === 0) {
    return '0 KB';
  }
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Open native image gallery picker
 */
export async function pickImage() {
  try {
    const response = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.85,
      selectionLimit: 1,
    });

    if (response.didCancel || !response.assets || response.assets.length === 0) {
      return null;
    }

    const asset = response.assets[0];
    return {
      uri: asset.uri,
      name: asset.fileName || 'scanned_image.jpg',
      type: asset.type || 'image/jpeg',
      size: formatFileSize(asset.fileSize),
      rawSize: asset.fileSize,
      width: asset.width,
      height: asset.height,
    };
  } catch (error) {
    // If permission or native error occurs, fallback cleanly
    return null;
  }
}

/**
 * Open native video picker
 */
export async function pickVideo() {
  try {
    const response = await launchImageLibrary({
      mediaType: 'video',
      selectionLimit: 1,
    });

    if (response.didCancel || !response.assets || response.assets.length === 0) {
      return null;
    }

    const asset = response.assets[0];
    return {
      uri: asset.uri,
      name: asset.fileName || 'scanned_video.mp4',
      type: asset.type || 'video/mp4',
      size: formatFileSize(asset.fileSize),
      rawSize: asset.fileSize,
      duration: asset.duration,
    };
  } catch (error) {
    // Fallback to DocumentPicker for video
    try {
      const res = await DocumentPicker.pickSingle({
        type: [types.video],
      });
      return {
        uri: res.uri,
        name: res.name || 'scanned_video.mp4',
        type: res.type || 'video/mp4',
        size: formatFileSize(res.size),
        rawSize: res.size,
      };
    } catch (docError) {
      return null;
    }
  }
}

/**
 * Open native audio/file picker
 */
export async function pickAudio() {
  try {
    const res = await DocumentPicker.pickSingle({
      type: [types.audio, types.allFiles],
    });

    return {
      uri: res.uri,
      name: res.name || 'scanned_audio.m4a',
      type: res.type || 'audio/m4a',
      size: formatFileSize(res.size),
      rawSize: res.size,
    };
  } catch (error) {
    if (isCancel(error)) {
      return null;
    }
    return null;
  }
}
