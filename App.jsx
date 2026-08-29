// App.jsx — Root App with AppProviders + Theme + Accessibility + Notifications
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

import AppProviders from './src/app/providers/AppProviders';
import { useTheme } from './src/shared/hooks/useTheme';
import RootNavigator from './src/navigation/RootNavigator';
import { navigationRef, navigateToDetect } from './src/navigation/navigationRef';

import ScamAlertOverlay from './src/components/ScamAlertOverlay';
import {
  startListening,
  isAccessibilityEnabled,
  openAccessibilitySettings,
} from './src/services/accessibilityService';

const { NotificationModule } = NativeModules;
const notificationEmitter = new NativeEventEmitter(NotificationModule);

/* ───────────────────────────────────────────── */
/* PERMISSIONS & ACCESSIBILITY PROMPTS */
/* ───────────────────────────────────────────── */

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
  } catch {}
}

async function promptAccessibilitySetup() {
  if (Platform.OS !== 'android') return;
  try {
    const enabled = await isAccessibilityEnabled();
    if (!enabled) {
      Alert.alert(
        '🛡️ Enable Scam Protection',
        'Insightify can automatically detect scam messages in WhatsApp, Telegram, Instagram, and SMS.\n\nEnable "Insightify Scam Protection" in Accessibility settings.',
        [
          { text: 'Later', style: 'cancel' },
          { text: 'Open Settings', onPress: openAccessibilitySettings },
        ],
      );
    }
  } catch {}
}

/* ───────────────────────────────────────────── */
/* APP CONTENT (Theme-aware) */
/* ───────────────────────────────────────────── */

function AppContent() {
  const { colors, isDark } = useTheme();
  const [activeThreat, setActiveThreat] = useState(null);
  const seenHashesRef = useRef(new Set());

  const handleDismiss = useCallback(() => {
    setActiveThreat(null);
  }, []);

  const handleViewDetails = useCallback(threat => {
    setActiveThreat(null);
    if (threat?.message) {
      setTimeout(() => {
        navigateToDetect({
          text: threat.message,
          autofillText: threat.message,
        });
      }, 300);
    }
  }, []);

  const processIncomingThreat = useCallback(payload => {
    try {
      const data =
        typeof payload === 'string' ? JSON.parse(payload) : payload;
      if (!data) return;

      const text = data.text || data.message || '';
      if (text.length < 10) return;

      const hash = text.trim().toLowerCase();
      if (seenHashesRef.current.has(hash)) return;
      seenHashesRef.current.add(hash);

      const score =
        data.localScore ??
        (data.score ? Math.round(data.score * 5) : 0);

      if (score >= 2 || data.source === 'accessibility') {
        setActiveThreat({
          message: text,
          app: data.app || '',
          localScore: score,
          source: data.source || '',
          hasLink: data.hasLink || false,
          timestamp: Date.now(),
        });
      }

      navigateToDetect({ text, autofillText: text });
    } catch (e) {
      console.warn('Threat parse error:', e);
    }
  }, []);

  useEffect(() => {
    const interactionHandle = InteractionManager.runAfterInteractions(() => {
      setTimeout(requestNotificationPermission, 2000);
      setTimeout(promptAccessibilitySetup, 3000);
    });

    // Notification listener
    (async () => {
      try {
        const payload = await NotificationModule?.getLaunchPayload?.();
        if (payload) processIncomingThreat(payload);
      } catch {}
    })();

    const notifSub = notificationEmitter.addListener(
      'NotificationReceived',
      processIncomingThreat,
    );

    // Accessibility listener
    const accessSub = startListening?.(event => {
      if (!event?.message) return;
      const hash = event.message.trim().toLowerCase();
      if (seenHashesRef.current.has(hash)) return;
      seenHashesRef.current.add(hash);

      if (event.localScore >= 2) setActiveThreat(event);
    });

    return () => {
      interactionHandle.cancel();
      notifSub?.remove();
      accessSub?.remove?.();
    };
  }, [processIncomingThreat]);

  return (
    <NavigationContainer ref={navigationRef}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
        translucent={false}
      />
      <RootNavigator />
      <ScamAlertOverlay
        threat={activeThreat}
        onViewDetails={handleViewDetails}
        onDismiss={handleDismiss}
      />
    </NavigationContainer>
  );
}

/* ───────────────────────────────────────────── */
/* APP ROOT */
/* ───────────────────────────────────────────── */

export default function App() {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}