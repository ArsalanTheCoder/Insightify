import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Modal,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

/* ─────────────── MOCK DETECTION HISTORY DATA ─────────────── */

const INITIAL_HISTORY = [
  {
    id: '1',
    type: 'SMS Message',
    channelIcon: 'chatbox-ellipses',
    message: 'URGENT: Your bank account #4829 has been locked due to suspicious activity. Verify immediately at http://bank-secure-netfl1x.net/login',
    status: 'Suspicious',
    riskScore: 94,
    threatType: 'Smishing Phishing Link',
    timestamp: 'Today, 10:42 AM',
    isSaved: true,
    recommendations: [
      'Do not tap or open the web link.',
      'Never enter your PIN, OTP, or passwords on external links.',
      'Report and block the sender phone number.',
    ],
  },
  {
    id: '2',
    type: 'WhatsApp Audio',
    channelIcon: 'mic',
    message: 'Voice note claiming to be your relative needing immediate $500 transfer for bail.',
    status: 'Suspicious',
    riskScore: 88,
    threatType: 'AI Voice Clone Impersonation',
    timestamp: 'Yesterday, 4:15 PM',
    isSaved: false,
    recommendations: [
      'Call your relative directly on their primary phone number to verify.',
      'Ask a pre-agreed secret family safe word.',
    ],
  },
  {
    id: '3',
    type: 'Email Document',
    channelIcon: 'mail',
    message: 'Order Confirmation #69420 from official online store. Receipt attached.',
    status: 'Safe',
    riskScore: 4,
    threatType: 'Legitimate Transaction',
    timestamp: 'Aug 3, 2026',
    isSaved: false,
    recommendations: ['No suspicious links or malicious attachments found.'],
  },
  {
    id: '4',
    type: 'Image OCR Scan',
    channelIcon: 'image',
    message: 'Screenshot of a Facebook giveaway post promising 2 BTC for entering credit card info.',
    status: 'Suspicious',
    riskScore: 96,
    threatType: 'Crypto Giveaway Scam',
    timestamp: 'Aug 2, 2026',
    isSaved: true,
    recommendations: [
      'Celebrities and brands never ask for crypto deposits or credit cards.',
      'Do not scan QR codes in suspicious giveaway images.',
    ],
  },
  {
    id: '5',
    type: 'SMS Message',
    channelIcon: 'chatbox-ellipses',
    message: 'Your package delivery is pending due to unpaid $1.50 customs fee. Track at http://post-track-fee.org',
    status: 'Suspicious',
    riskScore: 91,
    threatType: 'Smishing Delivery Scam',
    timestamp: 'Jul 30, 2026',
    isSaved: false,
    recommendations: [
      'Official postal services do not demand fee payments over SMS links.',
      'Check tracking numbers directly on official courier websites.',
    ],
  },
  {
    id: '6',
    type: 'SMS Message',
    channelIcon: 'chatbox-ellipses',
    message: 'Hey, are we still meeting for lunch at 1 PM today?',
    status: 'Safe',
    riskScore: 2,
    threatType: 'Safe Conversation',
    timestamp: 'Jul 28, 2026',
    isSaved: false,
    recommendations: ['No security threats detected.'],
  },
];

const FILTERS = ['All', 'Suspicious', 'Safe', 'Saved'];

export default function DetectionHistoryScreen({ navigation }) {
  const [historyItems, setHistoryItems] = useState(INITIAL_HISTORY);
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedDetailItem, setSelectedDetailItem] = useState(null);

  /* ─────────────── FILTER & STATS ─────────────── */

  const filteredData = useMemo(() => {
    return historyItems.filter((item) => {
      if (activeFilter === 'All') {
        return true;
      }
      if (activeFilter === 'Saved') {
        return item.isSaved;
      }
      return item.status === activeFilter;
    });
  }, [historyItems, activeFilter]);

  const stats = useMemo(() => {
    const total = historyItems.length;
    const suspicious = historyItems.filter((i) => i.status === 'Suspicious').length;
    const safe = historyItems.filter((i) => i.status === 'Safe').length;
    return { total, suspicious, safe };
  }, [historyItems]);

  const toggleSaveItem = (id) => {
    setHistoryItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isSaved: !item.isSaved } : item)),
    );
  };

  const renderItem = ({ item }) => {
    const isSafe = item.status === 'Safe';

    return (
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={() => setSelectedDetailItem(item)}
        style={styles.historyCard}
      >
        {/* Left Status Bar */}
        <View style={[styles.statusStrip, isSafe ? styles.statusStripSafe : styles.statusStripDanger]} />

        <View style={styles.cardInner}>
          {/* Top Row */}
          <View style={styles.cardTopRow}>
            <View style={styles.channelRow}>
              <View style={[styles.channelIconBox, isSafe ? styles.channelIconBoxSafe : styles.channelIconBoxDanger]}>
                <Ionicons
                  name={item.channelIcon}
                  size={16}
                  color={isSafe ? '#059669' : '#DC2626'}
                />
              </View>
              <Text style={styles.typeText}>{item.type}</Text>
            </View>

            {/* Badge & Bookmark */}
            <View style={styles.rightBadgeRow}>
              <View style={[styles.statusBadge, isSafe ? styles.statusBadgeSafe : styles.statusBadgeDanger]}>
                <Ionicons
                  name={isSafe ? 'checkmark-circle' : 'warning'}
                  size={12}
                  color={isSafe ? '#059669' : '#DC2626'}
                />
                <Text style={[styles.statusBadgeText, isSafe ? styles.textSafe : styles.textDanger]}>
                  {isSafe ? 'Safe' : `${item.riskScore}% Scam`}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => toggleSaveItem(item.id)}
                style={styles.bookmarkBtn}
              >
                <Ionicons
                  name={item.isSaved ? 'bookmark' : 'bookmark-outline'}
                  size={18}
                  color={item.isSaved ? '#0056D2' : '#94A3B8'}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Message Preview */}
          <Text style={styles.messageText} numberOfLines={2}>
            {item.message}
          </Text>

          {/* Bottom Meta */}
          <View style={styles.cardBottomRow}>
            <Text style={styles.threatTypeText}>{item.threatType}</Text>
            <Text style={styles.timestampText}>{item.timestamp}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ── TOP HEADER ── */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.headerBackBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detection History</Text>
        <TouchableOpacity
          style={styles.headerBackBtn}
          onPress={() => setHistoryItems([])}
        >
          <Ionicons name="trash-outline" size={18} color="#64748B" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* ── HERO BANNER ── */}
        <LinearGradient
          colors={['#0056D2', '#0284C7']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <View style={styles.heroIconBox}>
            <Ionicons name="time-sharp" size={28} color="#0056D2" />
          </View>
          <View style={styles.heroTextCol}>
            <Text style={styles.heroTitle}>Analysis Log & Audit</Text>
            <Text style={styles.heroSub}>Review your past text, email & media scam scans</Text>
          </View>
        </LinearGradient>

        {/* ── STATS ROW ── */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total Scans</Text>
          </View>

          <View style={[styles.statCard, styles.statCardDanger]}>
            <Text style={[styles.statNumber, styles.textDanger]}>{stats.suspicious}</Text>
            <Text style={[styles.statLabel, styles.textDangerDark]}>Suspicious ⚠️</Text>
          </View>

          <View style={[styles.statCard, styles.statCardSuccess]}>
            <Text style={[styles.statNumber, styles.textSafe]}>{stats.safe}</Text>
            <Text style={[styles.statLabel, styles.textSafeDark]}>Safe ✅</Text>
          </View>
        </View>

        {/* ── FILTER PILLS ── */}
        <View style={styles.filterRow}>
          {FILTERS.map((f) => {
            const isActive = activeFilter === f;
            return (
              <TouchableOpacity
                key={f}
                activeOpacity={0.8}
                onPress={() => setActiveFilter(f)}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
              >
                <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                  {f === 'Suspicious' ? '⚠️ Suspicious' : f === 'Safe' ? '✅ Safe' : f === 'Saved' ? '🔖 Saved' : f}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── RECENT SCANS LIST ── */}
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Scan History Log</Text>
          <Text style={styles.sectionCount}>{filteredData.length} records</Text>
        </View>

        {filteredData.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="documents-outline" size={44} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>No History Records</Text>
            <Text style={styles.emptySub}>No scan entries match the "{activeFilter}" filter.</Text>
          </View>
        ) : (
          <FlatList
            data={filteredData}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            scrollEnabled={false}
          />
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* ── DETAILED ANALYSIS MODAL ── */}
      <Modal visible={!!selectedDetailItem} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {selectedDetailItem && (
              <>
                <View style={styles.modalHeader}>
                  <View style={styles.modalHeaderTitleRow}>
                    <Ionicons
                      name={selectedDetailItem.status === 'Safe' ? 'shield-checkmark' : 'warning'}
                      size={22}
                      color={selectedDetailItem.status === 'Safe' ? '#059669' : '#DC2626'}
                    />
                    <Text style={styles.modalHeaderTitle}>{selectedDetailItem.threatType}</Text>
                  </View>

                  <TouchableOpacity onPress={() => setSelectedDetailItem(null)} style={styles.modalCloseBtn}>
                    <Ionicons name="close" size={20} color="#0F172A" />
                  </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} style={styles.modalBody}>
                  {/* Status Banner */}
                  <View
                    style={[
                      styles.modalStatusBanner,
                      selectedDetailItem.status === 'Safe' ? styles.modalBannerSafe : styles.modalBannerDanger,
                    ]}
                  >
                    <Text
                      style={[
                        styles.modalStatusText,
                        selectedDetailItem.status === 'Safe' ? styles.textSafe : styles.textDanger,
                      ]}
                    >
                      Status: {selectedDetailItem.status.toUpperCase()} ({selectedDetailItem.riskScore}% Threat Risk)
                    </Text>
                  </View>

                  {/* Scanned Text Content */}
                  <Text style={styles.modalSectionLabel}>Scanned Message Content</Text>
                  <View style={styles.messageBox}>
                    <Text style={styles.messageBoxText}>{selectedDetailItem.message}</Text>
                  </View>

                  {/* Security Recommendations */}
                  <Text style={styles.modalSectionLabel}>Recommended Actions</Text>
                  {selectedDetailItem.recommendations.map((rec, idx) => (
                    <View key={idx} style={styles.recItem}>
                      <Ionicons name="checkmark-circle-outline" size={16} color="#0056D2" style={styles.recIcon} />
                      <Text style={styles.recText}>{rec}</Text>
                    </View>
                  ))}
                </ScrollView>

                {/* Modal Footer */}
                <TouchableOpacity
                  style={styles.modalDoneBtn}
                  onPress={() => setSelectedDetailItem(null)}
                >
                  <Text style={styles.modalDoneBtnText}>Close Details</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

/* ─────────────── STYLES ─────────────── */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  /* HEADER */
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerBackBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },

  /* HERO */
  heroCard: {
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#0056D2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  heroIconBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  heroTextCol: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  heroSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 16,
  },

  /* STATS */
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    elevation: 1,
  },
  statCardDanger: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  statCardSuccess: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 2,
  },

  /* TEXT COLORS */
  textSafe: {
    color: '#059669',
  },
  textSafeDark: {
    color: '#065F46',
  },
  textDanger: {
    color: '#DC2626',
  },
  textDangerDark: {
    color: '#991B1B',
  },

  /* FILTERS */
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  filterChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  filterChipActive: {
    backgroundColor: '#0056D2',
    borderColor: '#0056D2',
  },
  filterChipText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#475569',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },

  /* LIST HEADER */
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionCount: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },

  /* HISTORY CARDS */
  historyCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
  },
  statusStrip: {
    width: 5,
  },
  statusStripSafe: {
    backgroundColor: '#059669',
  },
  statusStripDanger: {
    backgroundColor: '#DC2626',
  },
  cardInner: {
    flex: 1,
    padding: 14,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  channelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  channelIconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  channelIconBoxSafe: {
    backgroundColor: '#ECFDF5',
  },
  channelIconBoxDanger: {
    backgroundColor: '#FEF2F2',
  },
  typeText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginLeft: 4,
  },
  rightBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
  },
  statusBadgeSafe: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  statusBadgeDanger: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    marginLeft: 2,
  },
  bookmarkBtn: {
    padding: 2,
  },

  messageText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 18,
    fontWeight: '500',
    marginBottom: 10,
  },

  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
  },
  threatTypeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  timestampText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
  },

  emptyState: {
    alignItems: 'center',
    padding: 30,
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#334155',
    marginTop: 10,
  },
  emptySub: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
  },

  /* MODAL */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginLeft: 4,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBody: {
    marginBottom: 16,
  },
  modalStatusBanner: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    alignItems: 'center',
  },
  modalBannerSafe: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  modalBannerDanger: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  modalStatusText: {
    fontSize: 12,
    fontWeight: '800',
  },
  modalSectionLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  messageBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  messageBoxText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 19,
  },
  recItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  recIcon: {
    marginTop: 2,
  },
  recText: {
    fontSize: 12.5,
    color: '#334155',
    lineHeight: 18,
    flex: 1,
  },
  modalDoneBtn: {
    backgroundColor: '#0056D2',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  modalDoneBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  bottomSpacer: {
    height: 20,
  },
});
