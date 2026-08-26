import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FeedCard from './components/FeedCard';
import Screen from '../../components/layout/Screen';

/* ─────────────── EXPANDED COMMUNITY ALERTS DATA ─────────────── */

const CATEGORIES = [
  { id: 'all', label: 'All Alerts', icon: 'shield-checkmark' },
  { id: 'trending', label: '🔥 Trending', icon: 'flame' },
  { id: 'VoiceCloning', label: '🎙️ Voice AI', icon: 'mic' },
  { id: 'Deepfake', label: '🤖 Deepfakes', icon: 'videocam' },
  { id: 'Phishing', label: '🎣 Phishing & SMS', icon: 'mail-unread' },
  { id: 'JobScam', label: '💼 Job & Crypto', icon: 'briefcase' },
  { id: 'Privacy', label: '🔐 Privacy & Hacks', icon: 'lock-closed' },
];

const INITIAL_FEED_DATA = [
  {
    id: '1',
    time: '45 mins ago',
    type: 'VoiceCloning',
    threatLevel: 'CRITICAL',
    title: 'The $200M Voice-Cloning Scams',
    description:
      '⚠️ MAJOR THREAT: Voice cloning scams have cost victims an estimated $200M in recent years.\n\n' +
      '• Scammers clone voices using short audio clips scraped from Instagram & TikTok.\n' +
      '• Target family members pretending to be in urgent legal or medical trouble.\n\n' +
      '🛡️ Defense Tip: Establish a secret offline family safe-word before transferring money.',
    image: require('../../../assets/images/scam1.jpeg'),
    isVerified: true,
    likes: 342,
    commentsCount: 28,
    sharesCount: 89,
    comments: [
      { id: 'c1', user: 'Sarah K.', text: 'My aunt almost fell for this last week! The voice sounded 100% identical.', time: '30m ago' },
      { id: 'c2', user: 'Alex M.', text: 'Safe-words are a lifesaver. Everyone should set one up today.', time: '15m ago' },
    ],
  },
  {
    id: '2',
    time: '2 hours ago',
    type: 'Phishing',
    threatLevel: 'WARNING',
    title: 'Urgent Banking SMS Link Scam',
    description:
      '⚠️ ALERT: Waves of smishing text messages claiming your bank account is suspended are targeting users today.\n\n' +
      '• Fake domain lookalikes like "netfl1x-verify.com" or "bank-security-login.net".\n' +
      '• Asks for full credit card details and OTP verification codes.\n\n' +
      '🔎 Rule: Never click bank verification links sent via SMS.',
    image: require('../../../assets/images/scam2.jpeg'),
    isVerified: true,
    likes: 512,
    commentsCount: 42,
    sharesCount: 130,
    comments: [
      { id: 'c3', user: 'David R.', text: 'Got 3 of these texts this morning. Blocked the number immediately.', time: '1h ago' },
    ],
  },
  {
    id: '3',
    time: '3 hours ago',
    type: 'VoiceCloning',
    threatLevel: 'WARNING',
    title: 'AI Can Steal Your Voice in 15 Seconds',
    description:
      '⚠️ NOTICE: Modern AI audio models require as little as 15 seconds of clear speech to generate realistic voice clones.\n\n' +
      '• Protect public audio uploads on YouTube and public social profiles.\n' +
      '• Avoid replying with long voice notes to unverified WhatsApp callers.',
    image: require('../../../assets/images/scam3.jpeg'),
    isVerified: true,
    likes: 189,
    commentsCount: 14,
    sharesCount: 45,
    comments: [],
  },
  {
    id: '4',
    time: '5 hours ago',
    type: 'Deepfake',
    threatLevel: 'CRITICAL',
    title: 'Fake Elon Musk Crypto Giveaway Live Streams',
    description:
      '⚠️ SCAM ALERT: High-definition AI deepfakes of tech leaders are broadcasting fake crypto doubling giveaways on YouTube.\n\n' +
      '• Scammers ask targets to send 1 BTC to receive 2 BTC back.\n' +
      '• Thousands of dollars lost in automated crypto wallets daily.\n\n' +
      '🚫 Fact: No legitimate executive or company hosts crypto doubling giveaways.',
    image: require('../../../assets/images/scam9.jpeg'),
    isVerified: true,
    likes: 678,
    commentsCount: 95,
    sharesCount: 210,
    comments: [
      { id: 'c4', user: 'Zaid H.', text: 'YouTube needs to take these channels down faster!', time: '2h ago' },
    ],
  },
  {
    id: '5',
    time: '6 hours ago',
    type: 'Deepfake',
    threatLevel: 'CRITICAL',
    title: 'CEO Video Conference Fraud ($5M Loss)',
    description:
      '⚠️ CRITICAL: A corporate finance team approved a $5M wire transfer after attending a video call with an AI deepfake CEO.\n\n' +
      'Threat tactics to watch for:\n' +
      '• Real-time video deepfakes overlaid during Zoom/Teams calls.\n' +
      '• Impersonation of high-level company executives.\n\n' +
      '🛡️ Defense: Require multi-person secondary phone verification for all wire transfers.',
    image: require('../../../assets/images/scam6.jpeg'),
    isVerified: true,
    likes: 840,
    commentsCount: 112,
    sharesCount: 310,
    comments: [],
  },
  {
    id: '6',
    time: '8 hours ago',
    type: 'JobScam',
    threatLevel: 'WARNING',
    title: 'WhatsApp $500/Day YouTube Like Scam',
    description:
      '⚠️ RECRUITMENT SCAM: Unsolicited WhatsApp messages offering $500/day for liking YouTube videos.\n\n' +
      '• Initial small payouts of $10 to build trust.\n' +
      '• Demands "prepayment training fees" or crypto deposits to unlock higher tasks.\n\n' +
      '🚫 Golden Rule: Legitimate jobs NEVER ask you to pay money to work.',
    image: require('../../../assets/images/scam8.jpeg'),
    isVerified: true,
    likes: 295,
    commentsCount: 38,
    sharesCount: 64,
    comments: [],
  },
  {
    id: '7',
    time: '12 hours ago',
    type: 'Privacy',
    threatLevel: 'ADVISORY',
    title: 'Oversharing Confidential Data in AI Chatbots',
    description:
      '⚠️ PRIVACY WARNING: Employees uploading proprietary code and customer records into public AI chatbots.\n\n' +
      '• Data fed into public models may be retained for training.\n' +
      '• Risks data leaks and compliance violations.\n\n' +
      '🔒 Best Practice: Use enterprise-sanctioned AI tools with zero data retention enabled.',
    image: require('../../../assets/images/scam11.jpeg'),
    isVerified: true,
    likes: 215,
    commentsCount: 19,
    sharesCount: 52,
    comments: [],
  },
  {
    id: '8',
    time: '1 day ago',
    type: 'Privacy',
    threatLevel: 'CRITICAL',
    title: '3.2 Billion Passwords Exposed in Breach',
    description:
      '⚠️ SECURITY ALERT: Combined database leak of 3.2B credentials released on dark web forums.\n\n' +
      '• Hackers use automated bots to test credentials across popular sites.\n' +
      '• Reused passwords leave all associated accounts vulnerable.\n\n' +
      '🔐 Action Required: Enable 2FA and update passwords on primary accounts immediately.',
    image: require('../../../assets/images/scam7.jpeg'),
    isVerified: true,
    likes: 920,
    commentsCount: 156,
    sharesCount: 420,
    comments: [],
  },
];

export default function FeedScreen() {
  const [feedData] = useState(INITIAL_FEED_DATA);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [notificationsCount] = useState(3);

  /* ─────────────── FILTERING LOGIC ─────────────── */
  const filteredFeed = useMemo(() => {
    return feedData.filter((item) => {
      // Category Filter
      let matchesCategory = true;
      if (selectedCategory === 'trending') {
        matchesCategory = item.likes >= 400 || item.threatLevel === 'CRITICAL';
      } else if (selectedCategory !== 'all') {
        matchesCategory = item.type === selectedCategory;
      }

      // Search Query Filter
      let matchesSearch = true;
      if (searchQuery.trim().length > 0) {
        const query = searchQuery.toLowerCase();
        matchesSearch =
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.type.toLowerCase().includes(query);
      }

      return matchesCategory && matchesSearch;
    });
  }, [feedData, selectedCategory, searchQuery]);

  return (
    <Screen backgroundColor="#F8FAFC" padded={false} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ── TOP BAR ── */}
      <View style={styles.topBar}>
        <View style={styles.brandCol}>
          <Text style={styles.logoText}>Insightify</Text>
          <Text style={styles.subText}>Community Scam Alerts</Text>
        </View>

        <View style={styles.topActionIcons}>
          <TouchableOpacity
            style={[styles.iconBtn, showSearch && styles.iconBtnActive]}
            onPress={() => {
              setShowSearch(!showSearch);
              if (showSearch) {
                setSearchQuery('');
              }
            }}
          >
            <Ionicons
              name={showSearch ? 'close' : 'search'}
              size={20}
              color={showSearch ? '#0056D2' : '#334155'}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="notifications-outline" size={20} color="#334155" />
            {notificationsCount > 0 && (
              <View style={styles.notifBadge}>
                <Text style={styles.notifBadgeText}>{notificationsCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* ── LIVE SEARCH BAR ── */}
      {showSearch && (
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <Ionicons name="search" size={16} color="#64748B" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search alerts (e.g. WhatsApp, Bank, Deepfake)..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={16} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* ── CATEGORY FILTER PILLS ── */}
      <View style={styles.categoryBar}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CATEGORIES}
          keyExtractor={(cat) => cat.id}
          contentContainerStyle={styles.categoryScroll}
          renderItem={({ item: cat }) => {
            const isActive = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.chipBtn, isActive && styles.chipBtnActive]}
                onPress={() => setSelectedCategory(cat.id)}
              >
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* ── FEED LIST ── */}
      <FlatList
        data={filteredFeed}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <FeedCard post={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="shield-outline" size={48} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>No Alerts Found</Text>
            <Text style={styles.emptySub}>
              Try clearing your search query or selecting a different category.
            </Text>
          </View>
        }
      />
    </Screen>
  );
}

/* ─────────────── STYLES ─────────────── */

const styles = StyleSheet.create({
  topBar: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandCol: {
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0056D2',
    letterSpacing: -0.5,
  },
  subText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 1,
  },
  topActionIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    position: 'relative',
  },
  iconBtnActive: {
    backgroundColor: '#E0F2FE',
    borderColor: '#BAE6FD',
  },
  notifBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#DC2626',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  notifBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFFFFF',
  },

  /* SEARCH */
  searchContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
    padding: 0,
  },

  /* CATEGORIES */
  categoryBar: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  categoryScroll: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  chipBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipBtnActive: {
    backgroundColor: '#0056D2',
    borderColor: '#0056D2',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },

  /* LIST */
  listContent: {
    paddingTop: 12,
    paddingBottom: 24,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#334155',
    marginTop: 12,
  },
  emptySub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
});
