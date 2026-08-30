/**
 * Insightify — Profile API Service (Development Mock Data & Service)
 *
 * Centralized data provider for User Profile, Leaderboard (Daily / Monthly / All Time),
 * Achievements, and Settings.
 * Conforms to expected future FastAPI endpoints for clean API replacement.
 *
 * AGENTS.md & docs/RULES.md
 */

import { AVATARS } from '../../../shared/constants/avatars';

export const MOCK_USER_PROFILE = {
  id: 'usr_001',
  name: 'Muhammad Maaz',
  username: 'maaz_dev',
  title: 'AI Awareness Champion',
  bio: 'Fighting scams & making the internet safer 🚀',
  xp: 820,
  nextXp: 1000,
  level: 6,
  rank: 69,
  safetyScore: 92,
  threatsPrevented: 19,
  scans: 47,
  reports: 8,
  verifications: 12,
  avatar: AVATARS.image1,
};

export const MOCK_LEADERBOARD = {
  Daily: [
    {
      id: 'd1',
      name: 'Hasan Sajjad',
      score: 1800,
      avatar: AVATARS.image2,
      rank: 1,
    },
    {
      id: 'd2',
      name: 'Masuma',
      score: 1490,
      avatar: AVATARS.image3,
      rank: 2,
    },
    {
      id: 'd3',
      name: 'Tanim',
      score: 1205,
      avatar: AVATARS.image4,
      rank: 3,
    },
    {
      id: 'd4',
      name: 'Sadia Afrin',
      score: 1000,
      avatar: 'https://i.pravatar.cc/150?img=47',
      rank: 4,
    },
    {
      id: 'd5',
      name: 'Rejaul Karim',
      score: 900,
      avatar: 'https://i.pravatar.cc/150?img=12',
      rank: 5,
    },
    {
      id: 'd6',
      name: 'Hasnat',
      score: 800,
      avatar: 'https://i.pravatar.cc/150?img=68',
      rank: 6,
    },
    {
      id: 'd7',
      name: 'Nishat Jahan',
      score: 750,
      avatar: 'https://i.pravatar.cc/150?img=38',
      rank: 7,
    },
    {
      id: 'd8',
      name: 'Sajjad (You)',
      score: 720,
      avatar: AVATARS.image1,
      rank: 8,
      me: true,
    },
    {
      id: 'd9',
      name: 'Usman Ali',
      score: 610,
      avatar: 'https://i.pravatar.cc/150?img=59',
      rank: 9,
    },
    {
      id: 'd10',
      name: 'Ayesha Malik',
      score: 590,
      avatar: 'https://i.pravatar.cc/150?img=49',
      rank: 10,
    },
  ],
  Monthly: [
    {
      id: 'm1',
      name: 'Hasan Sajjad',
      score: 1800,
      avatar: AVATARS.image2,
      rank: 1,
    },
    {
      id: 'm2',
      name: 'Masuma',
      score: 1490,
      avatar: AVATARS.image3,
      rank: 2,
    },
    {
      id: 'm3',
      name: 'Tanim',
      score: 1205,
      avatar: AVATARS.image4,
      rank: 3,
    },
    {
      id: 'm4',
      name: 'Sadia Afrin',
      score: 1000,
      avatar: 'https://i.pravatar.cc/150?img=47',
      rank: 4,
    },
    {
      id: 'm5',
      name: 'Rejaul Karim',
      score: 900,
      avatar: 'https://i.pravatar.cc/150?img=12',
      rank: 5,
    },
    {
      id: 'm6',
      name: 'Hasnat',
      score: 800,
      avatar: 'https://i.pravatar.cc/150?img=68',
      rank: 6,
    },
    {
      id: 'm7',
      name: 'Muhammad Maaz',
      score: 780,
      avatar: AVATARS.image1,
      rank: 7,
      me: true,
    },
    {
      id: 'm8',
      name: 'Nishat Jahan',
      score: 750,
      avatar: 'https://i.pravatar.cc/150?img=38',
      rank: 8,
    },
    {
      id: 'm9',
      name: 'Usman Ali',
      score: 610,
      avatar: 'https://i.pravatar.cc/150?img=59',
      rank: 9,
    },
    {
      id: 'm10',
      name: 'Ayesha Malik',
      score: 590,
      avatar: 'https://i.pravatar.cc/150?img=49',
      rank: 10,
    },
  ],
  'All Time': [
    {
      id: 'a1',
      name: 'Hasan Sajjad',
      score: 175420,
      avatar: AVATARS.image2,
      rank: 1,
    },
    {
      id: 'a2',
      name: 'Masuma',
      score: 168900,
      avatar: AVATARS.image3,
      rank: 2,
    },
    {
      id: 'a3',
      name: 'Tanim',
      score: 162300,
      avatar: AVATARS.image4,
      rank: 3,
    },
    {
      id: 'a4',
      name: 'Sadia Afrin',
      score: 155200,
      avatar: 'https://i.pravatar.cc/150?img=47',
      rank: 4,
    },
    {
      id: 'a5',
      name: 'Muhammad Maaz',
      score: 148750,
      avatar: AVATARS.image1,
      rank: 5,
      me: true,
    },
    {
      id: 'a6',
      name: 'Rejaul Karim',
      score: 142100,
      avatar: 'https://i.pravatar.cc/150?img=12',
      rank: 6,
    },
    {
      id: 'a7',
      name: 'Hasnat',
      score: 136800,
      avatar: 'https://i.pravatar.cc/150?img=68',
      rank: 7,
    },
    {
      id: 'a8',
      name: 'Nishat Jahan',
      score: 129400,
      avatar: 'https://i.pravatar.cc/150?img=38',
      rank: 8,
    },
    {
      id: 'a9',
      name: 'Usman Ali',
      score: 121500,
      avatar: 'https://i.pravatar.cc/150?img=59',
      rank: 9,
    },
    {
      id: 'a10',
      name: 'Ayesha Malik',
      score: 114000,
      avatar: 'https://i.pravatar.cc/150?img=49',
      rank: 10,
    },
  ],
};

export const MOCK_ACHIEVEMENTS = [
  // 1. Unlocked Achievements
  {
    id: 'a1',
    title: 'Scam Spotter',
    desc: 'Detect 10 scams',
    points: 50,
    level: 'Level 3',
    unlockedDate: 'May 24, 2025',
    iconName: 'shield-checkmark',
    iconColor: '#10B981',
    bg: '#ECFDF5',
    pillBg: '#D1FAE5',
    pillTextColor: '#047857',
    unlocked: true,
  },
  {
    id: 'a2',
    title: '7 Day Streak',
    desc: 'Stay active for 7 consecutive days',
    points: 30,
    level: 'Level 2',
    unlockedDate: 'May 20, 2025',
    iconName: 'flame',
    iconColor: '#EA580C',
    bg: '#FFF7ED',
    pillBg: '#FFEDD5',
    pillTextColor: '#C2410C',
    unlocked: true,
  },
  {
    id: 'a3',
    title: 'First Detection',
    desc: 'Identify your first scam',
    points: 20,
    level: 'Level 1',
    unlockedDate: 'May 18, 2025',
    iconName: 'trophy',
    iconColor: '#CA8A04',
    bg: '#FEFCE8',
    pillBg: '#FEF08A',
    pillTextColor: '#A16207',
    unlocked: true,
  },
  {
    id: 'a4',
    title: 'Community Star',
    desc: 'Report 50 scams',
    points: 100,
    level: 'Level 2',
    unlockedDate: 'May 15, 2025',
    iconName: 'ribbon',
    iconColor: '#9333EA',
    bg: '#FAF5FF',
    pillBg: '#F3E8FF',
    pillTextColor: '#7E22CE',
    unlocked: true,
  },

  // 2. Locked Achievements
  {
    id: 'a5',
    title: 'Phishing Fighter',
    desc: 'Report 10 phishing attempts',
    points: 50,
    level: 'Level 2',
    iconName: 'shield',
    iconColor: '#2563EB',
    bg: '#EFF6FF',
    unlocked: false,
  },
  {
    id: 'a6',
    title: 'Threat Blocker',
    desc: 'Block 100 threats',
    points: 100,
    level: 'Level 3',
    iconName: 'bug',
    iconColor: '#EF4444',
    bg: '#FEF2F2',
    unlocked: false,
  },
  {
    id: 'a7',
    title: 'Master Learner',
    desc: 'Complete 20 lessons',
    points: 80,
    level: 'Level 4',
    iconName: 'school',
    iconColor: '#0284C7',
    bg: '#F0F9FF',
    unlocked: false,
  },
  {
    id: 'a8',
    title: 'Guardian',
    desc: 'Protect 100 users',
    points: 200,
    level: 'Level 5',
    iconName: 'people',
    iconColor: '#8B5CF6',
    bg: '#F5F3FF',
    unlocked: false,
  },
];

let runtimeProfile = { ...MOCK_USER_PROFILE };

export async function getUserProfile() {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return { ...runtimeProfile };
}

export async function updateUserProfile(updatedFields) {
  await new Promise((resolve) => setTimeout(resolve, 200));
  runtimeProfile = { ...runtimeProfile, ...updatedFields };
  return { ...runtimeProfile };
}

export async function getLeaderboard(period = 'Daily') {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return MOCK_LEADERBOARD[period] || MOCK_LEADERBOARD.Daily;
}

export async function getAchievements() {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return [...MOCK_ACHIEVEMENTS];
}
