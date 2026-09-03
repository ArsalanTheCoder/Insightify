/**
 * Insightify — Detection API Service (Development Mock Data & Simulation)
 *
 * Provides isolated mock analysis results, scan submission simulation, and historical telemetry.
 * Conforms to the expected future FastAPI REST API contracts for seamless backend replacement.
 *
 * docs/RFC/RFC-004-F-detection-and-scan-history.md section 9 & section 11
 */


export const MOCK_SCAN_HISTORY = [
  {
    id: 'scan_001',
    type: 'text',
    displayType: 'Phishing SMS',
    title: 'Suspicious Text Message',
    snippet: '"Dear customer, your account will be locked. Verify now: bit.ly/kyz123"',
    riskLevel: 'HIGH',
    confidence: 92,
    scannedAt: 'May 24, 2024 • 11:42 AM',
    timeAgo: '11:42 AM',
    heroTitle: 'Threat Detected!',
    heroSubtitle: 'This content is likely a scam and may steal your data or money.',
    reasons: [
      'Impersonates a financial institution',
      'Contains suspicious link',
      'Requests sensitive information',
      'Reported by multiple users',
    ],
  },
  {
    id: 'scan_002',
    type: 'image',
    displayType: 'Screenshot Analysis',
    title: 'Screenshot Analysis',
    snippet: 'IMG_20250520_1142.png',
    riskLevel: 'MEDIUM',
    confidence: 76,
    scannedAt: 'May 24, 2024 • 11:25 AM',
    timeAgo: '11:25 AM',
    heroTitle: 'Suspicious Content',
    heroSubtitle: 'This image exhibits deceptive giveaway patterns. Proceed with caution.',
    reasons: [
      'Unverified brand giveaway claim',
      'Obscure shortened destination link',
      'High pressure urgency countdown',
    ],
  },
  {
    id: 'scan_003',
    type: 'email',
    displayType: 'WhatsApp Message',
    title: 'Email Content',
    snippet: 'Invoice_Updated_2025.pdf',
    riskLevel: 'LOW',
    confidence: 91,
    scannedAt: 'May 24, 2024 • 10:58 AM',
    timeAgo: '10:58 AM',
    heroTitle: 'Looks Safe',
    heroSubtitle: "We didn't find any major threats in this content.",
    reasons: [
      'No suspicious patterns found',
      'No harmful links detected',
      'No data theft indicators',
      'Safe content',
    ],
  },
  {
    id: 'scan_004',
    type: 'text',
    displayType: 'Malicious Webpage',
    title: 'URL Analysis',
    snippet: 'https://secure-login-update.com',
    riskLevel: 'HIGH',
    confidence: 98,
    scannedAt: 'May 24, 2024 • 09:47 AM',
    timeAgo: '09:47 AM',
    heroTitle: 'Threat Detected!',
    heroSubtitle: 'This URL is a known phishing clone designed to harvest credentials.',
    reasons: [
      'Typosquatting legitimate bank domain',
      'SSL certificate issued within past 24 hours',
      'Blacklisted on global threat intelligence feeds',
    ],
  },
  {
    id: 'scan_005',
    type: 'audio',
    displayType: 'Voice Note',
    title: 'Audio Message',
    snippet: 'Voice_Note_20250520.m4a',
    riskLevel: 'MEDIUM',
    confidence: 84,
    scannedAt: 'May 23, 2024 • 04:15 PM',
    timeAgo: 'Yesterday',
    heroTitle: 'Suspicious Content',
    heroSubtitle: 'Synthetic speech artifacts detected indicating potential voice cloning.',
    reasons: [
      'Synthetic spectral acoustic frequency patterns',
      'High emotional urgency with money transfer demand',
      'No ambient acoustic background consistency',
    ],
  },
];

// Runtime in-memory history storage
let runtimeScans = [...MOCK_SCAN_HISTORY];
let bookmarkedResults = new Set(['scan_001']);

/**
 * Submit content for AI scan analysis
 * (TBD: real FastAPI endpoint POST /api/v1/detect/analyze)
 */
export async function submitScanAnalysis({ mode = 'text', content = '', attachment = null }) {
  // Simulate AI analysis delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const lowerContent = (content || '').toLowerCase();
  const attachmentName = attachment?.name || '';

  // Realistic mock heuristic based on input content
  let riskLevel = 'LOW';
  let confidence = 91;
  let heroTitle = 'Looks Safe';
  let heroSubtitle = "We didn't find any major threats in this content.";
  let displayType = mode === 'text' ? 'WhatsApp Message' : `${mode.charAt(0).toUpperCase() + mode.slice(1)} File`;
  let reasons = [
    'No suspicious patterns found',
    'No harmful links detected',
    'No data theft indicators',
    'Safe content',
  ];

  if (
    lowerContent.includes('verify') ||
    lowerContent.includes('lock') ||
    lowerContent.includes('bit.ly') ||
    lowerContent.includes('bank') ||
    lowerContent.includes('password') ||
    lowerContent.includes('otp') ||
    lowerContent.includes('urgent') ||
    attachmentName.toLowerCase().includes('phish') ||
    attachmentName.toLowerCase().includes('scam')
  ) {
    riskLevel = 'HIGH';
    confidence = 94;
    displayType = mode === 'text' ? 'Phishing SMS' : 'Malicious File';
    heroTitle = 'Threat Detected!';
    heroSubtitle = 'This content is likely a scam and may steal your data or money.';
    reasons = [
      'Impersonates a financial institution',
      'Contains suspicious link',
      'Requests sensitive information',
      'Reported by multiple users',
    ];
  } else if (
    lowerContent.includes('won') ||
    lowerContent.includes('prize') ||
    lowerContent.includes('free') ||
    lowerContent.includes('offer') ||
    lowerContent.includes('claim') ||
    mode === 'audio' ||
    mode === 'video'
  ) {
    riskLevel = 'MEDIUM';
    confidence = 78;
    displayType = mode === 'audio' ? 'Voice Note' : mode === 'video' ? 'Deepfake Video' : 'Sponsored Offer';
    heroTitle = 'Suspicious Content';
    heroSubtitle = 'This content exhibits deceptive patterns. Proceed with caution.';
    reasons = [
      'Unverified giveaway/emergency claim',
      'Potential synthetic speech/video artifacts',
      'High pressure urgency countdown',
    ];
  }

  const now = new Date();
  const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formattedDate = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const newScanResult = {
    id: `scan_${Date.now()}`,
    type: mode,
    displayType,
    title: mode === 'text' ? 'Suspicious Text Message' : `${mode.charAt(0).toUpperCase() + mode.slice(1)} Analysis`,
    snippet: content ? `"${content.slice(0, 50)}..."` : (attachmentName || `${mode} file`),
    riskLevel,
    confidence,
    scannedAt: `${formattedDate} • ${formattedTime}`,
    timeAgo: formattedTime,
    heroTitle,
    heroSubtitle,
    reasons,
    isBookmarked: false,
  };

  // Prepend to history
  runtimeScans = [newScanResult, ...runtimeScans];

  return newScanResult;
}

/**
 * Fetch scan history list and summary metrics
 * (TBD: real FastAPI endpoint GET /api/v1/detect/history)
 */
export async function getScanHistory() {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const totalScans = runtimeScans.length;
  const totalThreats = runtimeScans.filter((s) => s.riskLevel === 'HIGH' || s.riskLevel === 'MEDIUM').length;

  return {
    scans: runtimeScans.map((s) => ({
      ...s,
      isBookmarked: bookmarkedResults.has(s.id),
    })),
    stats: {
      totalScans,
      totalThreats,
    },
  };
}

/**
 * Fetch single scan result details
 * (TBD: real FastAPI endpoint GET /api/v1/detect/history/{id})
 */
export async function getScanResultDetail(resultId) {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const result = runtimeScans.find((s) => s.id === resultId);
  if (!result) {
    throw new Error('Scan result not found');
  }

  return {
    ...result,
    isBookmarked: bookmarkedResults.has(result.id),
  };
}

/**
 * Toggle bookmark on scan result
 * (TBD: real FastAPI endpoint POST /api/v1/detect/{id}/bookmark)
 */
export async function toggleResultBookmark(resultId) {
  await new Promise((resolve) => setTimeout(resolve, 150));
  if (bookmarkedResults.has(resultId)) {
    bookmarkedResults.delete(resultId);
    return false;
  } else {
    bookmarkedResults.add(resultId);
    return true;
  }
}
