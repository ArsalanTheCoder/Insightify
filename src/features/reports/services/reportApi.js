/**
 * Insightify — reportApi.js (Reports Feature Service)
 *
 * Centralized mock data and service layer for the Reports feature.
 * Structured for future FastAPI backend integration.
 *
 * AGENTS.md & docs/RULES.md
 */

// Report reason options matching approved UI reference
export const REPORT_REASONS = [
  {
    id: 'phishing',
    label: 'Phishing / Fake Login',
    description: 'Trying to steal my personal information',
    iconName: 'fish-outline',
  },
  {
    id: 'scam',
    label: 'Scam / Fraud',
    description: 'Looks like a scam or deceptive content',
    iconName: 'skull-outline',
  },
  {
    id: 'malware',
    label: 'Malware / Virus',
    description: 'Contains harmful files or links',
    iconName: 'bug-outline',
  },
  {
    id: 'spam',
    label: 'Spam',
    description: 'Unwanted or misleading content',
    iconName: 'mail-outline',
  },
  {
    id: 'other',
    label: 'Other',
    description: 'Something else',
    iconName: 'ellipsis-horizontal-circle-outline',
  },
];

/**
 * Submit a threat report.
 * Currently mock — replace with apiClient.post('/reports') for backend integration.
 *
 * @param {object} payload - { reasonId, details, evidence, threatContext }
 * @returns {Promise<{ reportId: string }>}
 */
export async function submitReport(payload) {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 1400));

  // Simulate occasional failure for testing (5% chance)
  if (Math.random() < 0.0) {
    throw new Error('Submission failed. Please try again.');
  }

  return {
    reportId: `rpt_${Date.now()}`,
    status: 'submitted',
    submittedAt: new Date().toISOString(),
  };
}
