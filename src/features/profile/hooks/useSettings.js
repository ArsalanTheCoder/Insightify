/**
 * Insightify — useSettings (Hook)
 *
 * Manages user preferences and settings switches.
 *
 * AGENTS.md & docs/RULES.md
 */

import { useState } from 'react';

export function useSettings() {
  const [settings, setSettings] = useState({
    profilePublic: true,
    showOnLeaderboard: true,
    anonymousReports: false,
    notificationsEnabled: true,
    scamAlerts: true,
    achievements: true,
    leaderboardUpdates: false,
    darkMode: false,
    lowDataMode: false,
  });

  const toggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return {
    settings,
    toggle,
  };
}
