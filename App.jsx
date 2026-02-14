// App.jsx — Root with dual listeners: Notification + Accessibility
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  NativeModules,
  NativeEventEmitter,
  Platform,
  PermissionsAndroid,
  Alert,
  StatusBar,
  InteractionManager,
} from 'react-native';

import RootNavigator from './src/navigation/RootNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { OnboardingProvider } from './src/context/OnboardingContext';
import { navigationRef, navigateToDetect } from './src/navigation/navigationRef';

import ScamAlertOverlay from './src/components/ScamAlertOverlay';
import {
  startListening,
  isAccessibilityEnabled,
  openAccessibilitySettings,
} from './src/services/accessibilityService';

const { NotificationModule } = NativeModules;
const notificationEmitter = new NativeEventEmitter(NotificationModule);

// ═══════════════════════════════════════
// PERMISSIONS ON FIRST LAUNCH (delayed)
// ═══════════════════════════════════════

async function requestNotificationPermission() {
  if (Platform.OS !== 'android' || Platform.Version < 33) return;
  try {
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      {
        title: 'Scam Alert Notifications',
        message:
          'Insightify needs notification permission to alert you about scam messages in real-time.',
        buttonPositive: 'Allow',
        buttonNegative: 'Deny',
      },
    );
  } catch (e) {
    // Silently ignore — not attached to activity yet
  }
}

async function promptAccessibilitySetup() {
  if (Platform.OS !== 'android') return;
  try {
    const enabled = await isAccessibilityEnabled();
    if (!enabled) {
      Alert.alert(
        '🛡️ Enable Scam Protection',
        'Insightify can automatically detect scam messages in WhatsApp, Telegram, Instagram, and SMS.\n\nTo enable this, turn on "Insightify Scam Protection" in Accessibility settings.',
        [
          { text: 'Later', style: 'cancel' },
          {
            text: 'Open Settings',
            onPress: () => openAccessibilitySettings(),
          },
        ],
        { cancelable: true },
      );
    }
  } catch (e) {
    // Silently ignore
  }
}

export default function App() {
  const [activeThreat, setActiveThreat] = useState(null);
  const seenHashesRef = useRef(new Set());

  const handleDismiss = useCallback(() => {
    setActiveThreat(null);
  }, []);

  const handleViewDetails = useCallback(threat => {
    setActiveThreat(null);
    if (threat && threat.message) {
      setTimeout(() => {
        navigateToDetect({ text: threat.message, autofillText: threat.message });
      }, 300);
    }
  }, []);

  /**
   * Process incoming notification/accessibility payload.
   * Shows in-app overlay popup for high-risk threats.
   */
  const processIncomingThreat = useCallback(
    payload => {
      try {
        const data =
          typeof payload === 'string' ? JSON.parse(payload) : payload;
        if (!data) return;

        const text = data.text || data.message || data.autofillText || '';
        if (!text || text.length < 10) return;

        // Dedup
        const hash = text.trim().toLowerCase();
        if (seenHashesRef.current.has(hash)) return;
        seenHashesRef.current.add(hash);

        if (seenHashesRef.current.size > 100) {
          const arr = [...seenHashesRef.current];
          seenHashesRef.current = new Set(arr.slice(arr.length - 50));
        }

        // Determine score — from accessibility detection or backend
        const score =
          data.localScore ||
          (data.score ? Math.round(data.score * 5) : 0);

        const source = data.source || '';
        const app = data.app || '';

        // For accessibility-detected threats (score >= 2): show popup overlay
        if (score >= 2 || source === 'accessibility') {
          setActiveThreat({
            message: text,
            app: app,
            localScore: score,
            source: source,
            hasLink: data.hasLink || false,
            timestamp: data.timestamp || Date.now(),
          });
        }

        // Always navigate to DetectScreen if app is open
        navigateToDetect({ text, autofillText: text });
      } catch (e) {
        console.warn('processIncomingThreat error:', e);
      }
    },
    [],
  );

  useEffect(() => {
    // ═══════════════════════════════════════
    // 0. REQUEST PERMISSIONS (delayed to avoid "not attached to activity")
    // ═══════════════════════════════════════
    const interactionHandle = InteractionManager.runAfterInteractions(() => {
      // Wait for activity to be fully ready
      setTimeout(() => {
        requestNotificationPermission();
      }, 2000);

      setTimeout(() => {
        promptAccessibilitySetup();
      }, 3000);
    });

    // ═══════════════════════════════════════
    // 1. NOTIFICATION LISTENER
    //    This receives BOTH regular notification events
    //    AND accessibility scam alerts (via ScamNotifier broadcast)
    // ═══════════════════════════════════════
    (async () => {
      try {
        const payloadStr = await NotificationModule.getLaunchPayload();
        if (payloadStr) {
          processIncomingThreat(payloadStr);
        }
      } catch (e) {
        // Silently ignore
      }
    })();

    const notifSub = notificationEmitter.addListener(
      'NotificationReceived',
      raw => {
        processIncomingThreat(raw);
      },
    );

    // ═══════════════════════════════════════
    // 2. ACCESSIBILITY LISTENER (backup path)
    //    Direct event from AccessibilityModule — works when
    //    app is in foreground and context is valid
    // ═══════════════════════════════════════
    const accessSub = startListening(event => {
      if (!event || !event.message) return;
      const localScore = event.localScore || 0;
      if (localScore >= 2) {
        // Dedup
        const hash = (event.message || '').trim().toLowerCase();
        if (seenHashesRef.current.has(hash)) return;
        seenHashesRef.current.add(hash);

        setActiveThreat(event);
      }
    });

    return () => {
      interactionHandle.cancel();
      notifSub.remove();
      if (accessSub) accessSub.remove();
    };
  }, [processIncomingThreat]);

  return (
    <AuthProvider>
      <OnboardingProvider>
        <NavigationContainer ref={navigationRef}>
          {/* Global StatusBar — prevents content from going behind system bar */}
          <StatusBar
            barStyle="dark-content"
            backgroundColor="#FFFFFF"
            translucent={false}
          />
          <RootNavigator />
          <ScamAlertOverlay
            threat={activeThreat}
            onViewDetails={handleViewDetails}
            onDismiss={handleDismiss}
          />
        </NavigationContainer>
      </OnboardingProvider>
    </AuthProvider>
  );
}
