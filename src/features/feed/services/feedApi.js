/**
 * Insightify — Feed API Service (Development Mock Data)
 *
 * Provides isolated mock threat records mapping to the 5 local bundled assets in assets/feed/.
 * Conforms to the expected future FastAPI REST API contracts for seamless backend replacement.
 *
 * docs/RFC/RFC-003-F-feed-and-feed-detail.md section 7 & section 11
 */

const BANKING_SCAM_ASSET = require('../../../../assets/feed/banking-scam.png');
const PHISHING_LINK_ASSET = require('../../../../assets/feed/phishing-link.png');
const VOICE_SCAM_ASSET = require('../../../../assets/feed/voice-scam.png');
const DEEPFAKE_ASSET = require('../../../../assets/feed/deepfake.png');
const THREAT_SCAM_ASSET = require('../../../../assets/feed/threat-scam.png');

export const MOCK_FEED_POSTS = [
  {
    id: 'threat_001',
    riskLevel: 'HIGH',
    title: 'Fake Banking SMS Circulating Again',
    description: 'Multiple users reported this SMS impersonating banks to steal credentials.',
    category: 'Banking',
    platformTag: 'SMS',
    location: 'Pakistan',
    reportCount: 103,
    viewCount: 246,
    timeAgo: '2m ago',
    timestamp: '2026-08-29T10:15:00Z',
    heroAsset: BANKING_SCAM_ASSET,
    isBookmarked: false,
    isVerified: true,
    reportedBy: {
      name: 'Insightify Community',
      badge: 'Verified',
      role: 'Community contributor',
    },
    whatIsHappening: 'Attackers are sending SMS messages impersonating banks to trick users into verifying accounts and stealing OTPs or personal information.',
    exampleContent: {
      type: 'sms',
      prefix: 'Dear customer, your account will be temporarily blocked. Verify now: ',
      link: 'bit.ly/kyz123',
    },
    evidence: [
      { id: 'ev_1', title: 'SMS Screenshot', uri: BANKING_SCAM_ASSET },
      { id: 'ev_2', title: 'Fake Login Page', uri: PHISHING_LINK_ASSET },
    ],
    safetyTips: [
      'Do not share OTPs or passwords with anyone.',
      'Do not click on links from unknown senders.',
      'Always verify from official app or website.',
    ],
  },
  {
    id: 'threat_002',
    riskLevel: 'MEDIUM',
    title: 'Phishing Links on Facebook Ads',
    description: 'Scammers are using fake ads to steal your login details.',
    category: 'Phishing',
    platformTag: 'Phishing',
    location: 'India',
    reportCount: 78,
    viewCount: 189,
    timeAgo: '15m ago',
    timestamp: '2026-08-29T10:02:00Z',
    heroAsset: PHISHING_LINK_ASSET,
    isBookmarked: false,
    isVerified: true,
    reportedBy: {
      name: 'CyberDefend Group',
      badge: 'Verified',
      role: 'Security researcher',
    },
    whatIsHappening: 'Fraudulent sponsored advertisements on Facebook and Instagram claim you won high-end headphones, directing you to a credential-harvesting clone page.',
    exampleContent: {
      type: 'ad',
      prefix: 'Dear customer, your account will be temporarily blocked. Verify now: ',
      link: 'bit.ly/verify-account',
    },
    evidence: [
      { id: 'ev_3', title: 'Sponsored Ad', uri: PHISHING_LINK_ASSET },
      { id: 'ev_4', title: 'Phishing Verification Page', uri: BANKING_SCAM_ASSET },
    ],
    safetyTips: [
      'Avoid clicking on links from unknown or unverified ads.',
      'Never enter your login details on suspicious pages.',
      'Report the ad and warn others in the community.',
    ],
  },
  {
    id: 'threat_003',
    riskLevel: 'INFO',
    title: 'Beware of Online Job Scams',
    description: 'Fake recruiters ask for advance payments or personal info.',
    category: 'Fraud',
    platformTag: 'Fraud',
    location: 'Nepal',
    reportCount: 51,
    viewCount: 134,
    timeAgo: '32m ago',
    timestamp: '2026-08-29T09:45:00Z',
    heroAsset: THREAT_SCAM_ASSET,
    isBookmarked: false,
    isVerified: false,
    reportedBy: {
      name: 'Community Contributor',
      badge: 'Community',
      role: 'Verified user',
    },
    whatIsHappening: 'Scammers promise $100–$300 daily for liking videos or rating hotels, but demand initial security deposits that are never refunded.',
    exampleContent: {
      type: 'job_ad',
      prefix: 'WORK FROM HOME. Earn Daily Rs. 5000+. No experience needed. Apply now: ',
      link: 't.me/earn_easy_24',
    },
    evidence: [
      { id: 'ev_5', title: 'Job Poster', uri: THREAT_SCAM_ASSET },
      { id: 'ev_6', title: 'Deposit Request Chat', uri: BANKING_SCAM_ASSET },
    ],
    safetyTips: [
      'Legitimate employers will never ask candidates to pay for a job or equipment.',
      'Beware of generic job descriptions offering unusually high daily pay.',
      'Do not disclose banking or national identity documents on messaging apps.',
    ],
  },
  {
    id: 'threat_004',
    riskLevel: 'HIGH',
    title: 'Urgent AI Voice-Cloning Scam',
    description: 'Scammers use short audio clips to impersonate family members claiming medical emergencies.',
    category: 'Voice AI',
    platformTag: 'Voice AI',
    location: 'United States',
    reportCount: 142,
    viewCount: 412,
    timeAgo: '45m ago',
    timestamp: '2026-08-29T09:30:00Z',
    heroAsset: VOICE_SCAM_ASSET,
    isBookmarked: true,
    isVerified: true,
    reportedBy: {
      name: 'AI Safety Watch',
      badge: 'Verified',
      role: 'Threat intelligence',
    },
    whatIsHappening: 'Attackers synthesize cloned voices of family members using generative AI audio tools, demanding instant crypto or wire transfers for fake emergencies.',
    exampleContent: {
      type: 'audio_transcript',
      prefix: '"Mom, I got into a severe accident and lost my wallet, please wire $2,000 to this urgent account right now..."',
      link: null,
    },
    evidence: [
      { id: 'ev_7', title: 'Audio Call Log', uri: VOICE_SCAM_ASSET },
      { id: 'ev_8', title: 'Urgent Payment Prompt', uri: PHISHING_LINK_ASSET },
    ],
    safetyTips: [
      'Establish a secret family offline safe-word that AI cannot guess.',
      'Hang up immediately and call the family member back on their known number.',
      'Never send funds under pressure before independent verification.',
    ],
  },
  {
    id: 'threat_005',
    riskLevel: 'HIGH',
    title: 'Executive Video Deepfake Transfer',
    description: 'Real-time video call deepfakes impersonating corporate executives requesting urgent wire transfers.',
    category: 'Deepfake',
    platformTag: 'Deepfake',
    location: 'United Kingdom',
    reportCount: 39,
    viewCount: 156,
    timeAgo: '1h ago',
    timestamp: '2026-08-29T09:15:00Z',
    heroAsset: DEEPFAKE_ASSET,
    isBookmarked: false,
    isVerified: true,
    reportedBy: {
      name: 'Enterprise Guard',
      badge: 'Verified',
      role: 'Corporate response team',
    },
    whatIsHappening: 'Fraudsters join video conference calls using real-time video deepfakes of directors to authorize high-value vendor payment modifications.',
    exampleContent: {
      type: 'video_call',
      prefix: 'Urgent vendor payment change requested during emergency executive video briefing: ',
      link: 'portal.auth-finance.co/transfer',
    },
    evidence: [
      { id: 'ev_9', title: 'Video Artifact Screenshot', uri: DEEPFAKE_ASSET },
      { id: 'ev_10', title: 'Phishing Email Header', uri: PHISHING_LINK_ASSET },
    ],
    safetyTips: [
      'Always enforce out-of-band multi-person payment authorization policies.',
      'Ask the caller to turn their head sideways (deepfake models often glitch at angles).',
      'Verify account modifications via physical phone lines.',
    ],
  },
];

// Memory state for bookmarks during runtime
let bookmarkedIds = new Set(['threat_004']);

/**
 * Fetch threat feed list with tab & category filtering
 * (TBD: real FastAPI endpoint GET /api/v1/feed?tab={tab}&category={category})
 */
export async function getThreatFeed({ tab = 'for_you', category = 'all' } = {}) {
  await new Promise((resolve) => setTimeout(resolve, 350));

  let items = [...MOCK_FEED_POSTS];

  // Category filter
  if (category && category !== 'all') {
    items = items.filter(
      (item) => item.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Tab filter simulation
  if (tab === 'trending') {
    items.sort((a, b) => b.reportCount - a.reportCount);
  } else if (tab === 'latest') {
    items.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  } else if (tab === 'nearby') {
    items = items.filter((item) => ['Pakistan', 'India', 'Nepal'].includes(item.location));
  }

  // Attach dynamic bookmark state
  return items.map((item) => ({
    ...item,
    isBookmarked: bookmarkedIds.has(item.id),
  }));
}

/**
 * Fetch single threat detail
 * (TBD: real FastAPI endpoint GET /api/v1/feed/{id})
 */
export async function getThreatDetail(threatId) {
  await new Promise((resolve) => setTimeout(resolve, 250));
  const threat = MOCK_FEED_POSTS.find((item) => item.id === threatId);
  if (!threat) {
    throw new Error('Threat not found');
  }
  return {
    ...threat,
    isBookmarked: bookmarkedIds.has(threat.id),
  };
}

/**
 * Toggle bookmark status
 * (TBD: real FastAPI endpoint POST /api/v1/feed/{id}/bookmark)
 */
export async function toggleThreatBookmark(threatId) {
  await new Promise((resolve) => setTimeout(resolve, 150));
  if (bookmarkedIds.has(threatId)) {
    bookmarkedIds.delete(threatId);
    return false;
  } else {
    bookmarkedIds.add(threatId);
    return true;
  }
}
