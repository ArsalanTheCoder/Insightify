/**
 * Insightify — Responsive Layout Utility & Hook
 *
 * Provides proportional scaling, font clamping, and device breakpoint helpers
 * to ensure consistent layout across all Android and iOS device dimensions.
 *
 * Baseline: 375 x 812 (standard mobile viewport)
 */

import { Dimensions, PixelRatio, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Baseline guideline dimensions
const BASELINE_WIDTH = 375;

/**
 * Width percentage of screen
 */
export function wp(percentage) {
  const value = (percentage * SCREEN_WIDTH) / 100;
  return Math.round(value);
}

/**
 * Height percentage of screen
 */
export function hp(percentage) {
  const value = (percentage * SCREEN_HEIGHT) / 100;
  return Math.round(value);
}

/**
 * Linear scale based on screen width
 */
export function scale(size) {
  return (SCREEN_WIDTH / BASELINE_WIDTH) * size;
}

/**
 * Moderate scale with damping factor to avoid extreme shrinking or expansion
 * @param {number} size - Baseline pixel size
 * @param {number} factor - Damping factor (default 0.5)
 */
export function moderateScale(size, factor = 0.5) {
  return Math.round(size + (scale(size) - size) * factor);
}

/**
 * Smart font scaling that clamps extreme device font scale settings
 */
export function scaleFont(size, factor = 0.35) {
  const newSize = size + (scale(size) - size) * factor;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

/**
 * React Hook providing live responsive dimensions, breakpoints, and insets
 */
export function useResponsive() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const isSmallDevice = width < 360;
  const isMediumDevice = width >= 360 && width < 412;
  const isLargeDevice = width >= 412;

  const dynamicWp = (percentage) => Math.round((percentage * width) / 100);
  const dynamicHp = (percentage) => Math.round((percentage * height) / 100);
  const dynamicScale = (size) => (width / BASELINE_WIDTH) * size;
  const dynamicModerateScale = (size, factor = 0.5) =>
    Math.round(size + (dynamicScale(size) - size) * factor);
  const dynamicScaleFont = (size, factor = 0.35) =>
    Math.round(PixelRatio.roundToNearestPixel(size + (dynamicScale(size) - size) * factor));

  return {
    width,
    height,
    insets,
    isSmallDevice,
    isMediumDevice,
    isLargeDevice,
    wp: dynamicWp,
    hp: dynamicHp,
    scale: dynamicScale,
    moderateScale: dynamicModerateScale,
    scaleFont: dynamicScaleFont,
  };
}
