import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Screen from '../../components/layout/Screen';

const FILTERS = ['All', 'Suspicious', 'Safe', 'Saved'];

const STATS = {
  total: 47,
  suspicious: 7,
  safe: 40,
};

const HISTORY_DATA = [
  {
    id: '1',
    type: 'Text Message',
    message: 'URGENT: Your bank account has been...',
    status: 'Suspicious',
    days: '1 day ago',
  },
  {
    id: '2',
    type: 'Email',
    message: 'Your Order #69420 has been shipped...',
    status: 'Safe',
    days: '2 days ago',
  },
  {
    id: '3',
    type: 'Text Message',
    message: 'Nice',
    status: 'Safe',
    days: '7 days ago',
  },
  {
    id: '4',
    type: 'Text Message',
    message: 'How are you',
    status: 'Safe',
    days: '7 days ago',
  },
  {
    id: '5',
    type: 'Text Message',
    message: 'URGENT: Your bank account has been...',
    status: 'Suspicious',
    days: '7 days ago',
  },
  {
    id: '6',
    type: 'Text Message',
    message: 'Hi',
    status: 'Safe',
    days: '7 days ago',
  },
];

export default function DetectionHistoryScreen({ navigation }) {
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredData = HISTORY_DATA.filter(item => {
    if (activeFilter === 'All') return true;
    return item.status === activeFilter;
  });

  const renderItem = ({ item }) => {
    const isSafe = item.status === 'Safe';
    const isSuspicious = item.status === 'Suspicious';

    const accentColor = isSafe
      ? '#22C55E'
      : isSuspicious
      ? '#F59E0B'
      : '#2563EB';

    const bgColor = isSafe
      ? '#ECFDF5'
      : isSuspicious
      ? '#FFFBEB'
      : '#EFF6FF';

    const iconName = isSafe ? 'shield-checkmark' : 'alert-circle';

    return (
      <View style={styles.listCard}>
        {/* Left Accent */}
        <View style={[styles.leftAccent, { backgroundColor: accentColor }]} />

        {/* Icon */}
        <View style={[styles.iconCircle, { backgroundColor: bgColor }]}>
          <Ionicons name={iconName} size={18} color={accentColor} />
        </View>

        {/* Content */}
        <View style={{ flex: 1 }}>
          <Text style={styles.itemTitle}>{item.type}</Text>
          <Text style={styles.itemSub} numberOfLines={1}>
            {item.message}
          </Text>

          {/* Status pill */}
          <View style={[styles.statusPill, { backgroundColor: bgColor }]}>
            <Text style={[styles.statusText, { color: accentColor }]}>
              {item.status}
            </Text>
          </View>
        </View>

        {/* Right */}
        <View style={styles.rightSection}>
          <Ionicons name="bookmark-outline" size={16} color="#9CA3AF" />
          <Text style={styles.timeText}>{item.days}</Text>
        </View>
      </View>
    );
  };

  return (
    <Screen padded edges={['top', 'bottom']} backgroundColor="#F8FAFF">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 🔵 HERO CARD */}
        <View style={styles.heroCard}>
          {/* Back Arrow INSIDE card */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.cardBackBtn}
            activeOpacity={0.85}
          >
            <Ionicons name="arrow-back" size={24} color="#2563EB" />
          </TouchableOpacity>

          <View style={styles.heroIcon}>
            <Ionicons name="time-outline" size={30} color="#2563EB" />
          </View>

          <Text style={styles.heroTitle}>Detection History</Text>
          <Text style={styles.heroSub}>Analyze Previous Reports</Text>
        </View>

        {/* 🔘 FILTERS */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          {FILTERS.map(item => (
            <TouchableOpacity
              key={item}
              onPress={() => setActiveFilter(item)}
              style={[
                styles.filterBtn,
                activeFilter === item && styles.filterBtnActive,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === item && styles.filterTextActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 📊 STATS */}
        <View style={styles.statsRow}>
          <StatCard title="Total Scans" value={STATS.total} />
          <StatCard title="Suspicious" value={STATS.suspicious} color="#F59E0B" />
          <StatCard title="Safe" value={STATS.safe} color="#22C55E" />
        </View>

        {/* 📜 LIST */}
        <Text style={styles.sectionTitle}>Recent Scans</Text>

        <FlatList
          data={filteredData}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          scrollEnabled={false}
        />
      </ScrollView>
    </Screen>
  );
}

const StatCard = ({ title, value, color = '#111827' }) => (
  <View style={styles.statCard}>
    <Text style={styles.statTitle}>{title}</Text>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
  </View>
);

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  cardBackBtn: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },

  screenTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111827',
  },

  /* HERO */
  heroCard: {
    backgroundColor: '#EAF2FF',
    borderRadius: 20,
    alignItems: 'center',
    padding: 24,
    margin: 16,
  },
  heroIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },
  heroSub: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },

  /* FILTERS */
  filterRow: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterBtnActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  filterText: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },

  /* STATS */
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statTitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 26,
    fontWeight: '800',
  },

  /* LIST */
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  listCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  leftAccent: {
    width: 4,
    height: '100%',
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    marginRight: 12,
  },

  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  itemTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  itemSub: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },

  statusPill: {
    marginTop: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },

  rightSection: {
    alignItems: 'flex-end',
    marginLeft: 8,
  },
  timeText: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 6,
  },
});
