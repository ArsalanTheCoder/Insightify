/**
 * Insightify — Home API Service (Development Baseline)
 *
 * Provides mock / local development data conforming to the expected future FastAPI contracts.
 * All functions are isolated to development mode until backend contracts are verified.
 *
 * docs/RFC/RFC-002-F-home-dashboard.md section 8
 */

export const MOCK_HOME_SUMMARY = {
  isProtected: true,
  activeSince: '2026-08-01T00:00:00Z',
  timeframe: 'this_week',
  scansCount: 24,
  threatsBlocked: 7,
  safeInteractionsRate: 98,
  alertsCount: 12,
};

export const MOCK_THREAT_FEED_PREVIEW = [
  {
    id: 'threat_001',
    riskLevel: 'HIGH',
    title: 'Fake Banking SMS Circulating Again',
    description: 'Multiple users reported this SMS impersonating banks to steal credentials.',
    location: 'Pakistan',
    timeAgo: '2m ago',
    type: 'sms',
    iconType: 'mail',
    verifiedCount: 142,
  },
  {
    id: 'threat_002',
    riskLevel: 'MEDIUM',
    title: 'Suspicious WhatsApp Link Detected',
    description: 'This link is reported for phishing attempts.',
    location: 'India',
    timeAgo: '15m ago',
    type: 'link',
    iconType: 'link',
    verifiedCount: 89,
  },
];

export const MOCK_DAILY_SAFETY_TIP = {
  id: 'tip_001',
  title: 'Daily Safety Tip',
  content: 'Never share OTPs, passwords, or personal information with anyone. Stay safe!',
  category: 'credential_safety',
};

export const MOCK_NOTIFICATIONS_COUNT = {
  unreadCount: 3,
};

/**
 * Fetch home summary telemetry
 * (TBD: real FastAPI endpoint GET /api/v1/protection/summary)
 */
export async function getHomeSummary(timeframe = 'this_week') {
  // Simulated local network latency
  await new Promise((resolve) => setTimeout(resolve, 300));
  return {
    ...MOCK_HOME_SUMMARY,
    timeframe,
  };
}

/**
 * Fetch live threat feed preview (limit 2)
 * (TBD: real FastAPI endpoint GET /api/v1/feed/preview?limit=2)
 */
export async function getThreatFeedPreview(limit = 2) {
  await new Promise((resolve) => setTimeout(resolve, 350));
  return MOCK_THREAT_FEED_PREVIEW.slice(0, limit);
}

/**
 * Fetch daily safety tip
 * (TBD: real FastAPI endpoint GET /api/v1/learn/daily-tip)
 */
export async function getDailySafetyTip() {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return MOCK_DAILY_SAFETY_TIP;
}

/**
 * Fetch unread notifications count
 * (TBD: real FastAPI endpoint GET /api/v1/notifications/unread-count)
 */
export async function getUnreadNotificationsCount() {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return MOCK_NOTIFICATIONS_COUNT;
}
