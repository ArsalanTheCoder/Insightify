// src/native/accessibility/accessibilityService.js
// Bridge to the native AccessibilityModule for real-time scam detection

import { NativeModules, NativeEventEmitter, Platform } from 'react-native';
import { semantic } from '../../shared/theme/colors';

const { AccessibilityModule } = NativeModules;

let eventEmitter = null;

/**
 * Get the NativeEventEmitter (lazy-init, Android only)
 */
function getEmitter() {
  if (!eventEmitter && Platform.OS === 'android' && AccessibilityModule) {
    eventEmitter = new NativeEventEmitter(AccessibilityModule);
  }
  return eventEmitter;
}

/**
 * Start listening for accessibility scam detection events.
 * @param {Function} onEvent - Callback receiving { message, source, app, alertTags, localScore, hasLink, timestamp }
 * @returns {Object|null} Subscription (call .remove() to stop)
 */
export function startListening(onEvent) {
  const emitter = getEmitter();
  if (!emitter) {
    return null;
  }

  const subscription = emitter.addListener('AccessibilityEvent', (event) => {
    if (typeof onEvent === 'function') {
      onEvent(event);
    }
  });

  return subscription;
}

/**
 * Open Android Accessibility Settings so user can enable Insightify.
 */
export function openAccessibilitySettings() {
  if (Platform.OS === 'android' && AccessibilityModule) {
    AccessibilityModule.openAccessibilitySettings();
  }
}

/**
 * Check if the accessibility service is currently enabled.
 * @returns {Promise<boolean>}
 */
export async function isAccessibilityEnabled() {
  if (Platform.OS === 'android' && AccessibilityModule) {
    try {
      return await AccessibilityModule.isAccessibilityEnabled();
    } catch (e) {
      return false;
    }
  }
  return false;
}

/**
 * Get human-readable app name from package name.
 */
export function getAppName(packageName) {
  if (!packageName) {
    return 'Unknown';
  }
  if (packageName.includes('whatsapp')) {
    return 'WhatsApp';
  }
  if (packageName.includes('telegram')) {
    return 'Telegram';
  }
  if (packageName.includes('instagram')) {
    return 'Instagram';
  }
  if (packageName.includes('messaging') || packageName.includes('mms')) {
    return 'SMS';
  }
  return 'Message';
}

/**
 * Get threat level from local score.
 */
export function getThreatLevel(localScore) {
  if (localScore >= 3) {
    return 'DANGEROUS';
  }
  if (localScore >= 2) {
    return 'SUSPICIOUS';
  }
  if (localScore >= 1) {
    return 'WARNING';
  }
  return 'SAFE';
}

/**
 * Get semantic color for threat level from canonical tokens.
 */
export function getThreatColor(level) {
  switch (level) {
    case 'DANGEROUS':
      return semantic.danger;
    case 'SUSPICIOUS':
      return semantic.warning;
    case 'WARNING':
      return semantic.info;
    default:
      return semantic.success;
  }
}
