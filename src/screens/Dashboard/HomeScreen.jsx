import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Dimensions, 
  SafeAreaView,
  StatusBar,
  FlatList,
  Modal,
  TouchableWithoutFeedback
} from 'react-native';
import { LineChart, PieChart, BarChart, ProgressChart } from 'react-native-chart-kit';
import auth from '@react-native-firebase/auth';
import Ionicons from 'react-native-vector-icons/Ionicons'; 

const screenWidth = Dimensions.get('window').width;
const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?name=User&background=0056D2&color=fff&size=128';

export default function HomeScreen({ navigation }) {
  const user = auth().currentUser;
  
  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState('');

  const handleNavigation = (screenName) => {
    if (screenName === 'Text') {
      // Navigate to the Detection Stack
      navigation.navigate('Detection', { screen: 'TextInput' }); 
    } else {
      // Show Custom Popup
      setActiveFeature(screenName);
      setModalVisible(true);
    }
  };

  // --- CHART DATA CONFIGURATION ---
  const renderChartItem = ({ item }) => (
    <View style={[styles.chartCard, { width: screenWidth - 48, marginRight: 12 }]}>
      <View style={styles.chartHeader}>
        <Text style={styles.chartTitle}>{item.title}</Text>
        {item.badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.badge}</Text>
          </View>
        )}
      </View>
      {item.component}
    </View>
  );

  const chartConfig = {
    backgroundColor: "#fff",
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 86, 210, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(100, 100, 100, ${opacity})`,
    propsForDots: { r: "4", strokeWidth: "2", stroke: "#0056D2" }
  };

  const chartsData = [
    {
      id: '1',
      title: 'Global Scam Trends',
      badge: '+12% vs Last Wk',
      component: (
        <LineChart
          data={{
            labels: ["M", "T", "W", "T", "F", "S", "S"],
            datasets: [{ data: [20, 45, 28, 80, 99, 43, 60] }]
          }}
          width={screenWidth - 80}
          height={180}
          chartConfig={chartConfig}
          bezier
          style={{ borderRadius: 16, marginTop: 10 }}
        />
      )
    },
    {
      id: '2',
      title: 'Most Common Scams',
      badge: 'By Category',
      component: (
        <PieChart
          data={[
            { name: "Phishing", population: 45, color: "#0056D2", legendFontColor: "#7F7F7F", legendFontSize: 12 },
            { name: "SMS", population: 25, color: "#42A5F5", legendFontColor: "#7F7F7F", legendFontSize: 12 },
            { name: "Calls", population: 20, color: "#90CAF9", legendFontColor: "#7F7F7F", legendFontSize: 12 },
            { name: "Other", population: 10, color: "#E3F2FD", legendFontColor: "#7F7F7F", legendFontSize: 12 }
          ]}
          width={screenWidth - 80}
          height={180}
          chartConfig={chartConfig}
          accessor={"population"}
          backgroundColor={"transparent"}
          paddingLeft={"15"}
          absolute
        />
      )
    },
    // --- ADDED BACK: Age Group Bar Chart ---
    {
      id: '3',
      title: 'Affected Age Groups',
      badge: 'This Month',
      component: (
        <BarChart
          data={{
            labels: ["18-25", "26-40", "41-60", "60+"],
            datasets: [{ data: [15, 30, 45, 60] }]
          }}
          width={screenWidth - 80}
          height={180}
          yAxisLabel=""
          chartConfig={chartConfig}
          style={{ borderRadius: 16, marginTop: 10 }}
        />
      )
    },
    {
      id: '4',
      title: 'My Safety Score',
      badge: 'Good',
      component: (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <ProgressChart
            data={{ labels: ["Safety"], data: [0.85] }}
            width={screenWidth - 80}
            height={180}
            strokeWidth={16}
            radius={32}
            chartConfig={{
              ...chartConfig,
              color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`,
            }}
            hideLegend={false}
          />
        </View>
      )
    }
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F6F8" />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        
        {/* 1. HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greetingText}>Hello, {user?.displayName?.split(' ')[0] || 'Guardian'} 👋</Text>
            <Text style={styles.subGreeting}>Stay safe from digital threats.</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Image source={{ uri: user?.photoURL || DEFAULT_AVATAR }} style={styles.avatar} />
          </TouchableOpacity>
        </View>

        {/* 2. HERO CARD */}
        <View style={styles.heroCard}>
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Detect Suspicious Messages</Text>
            <Text style={styles.heroSubtitle}>Analyze SMS, Emails, or Links instantly using our AI Engine.</Text>
            <TouchableOpacity 
              style={styles.heroButton}
              onPress={() => handleNavigation('Text')}
              activeOpacity={0.9}
            >
              <Text style={styles.heroButtonText}>Start Scan 🛡️</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 3. FEATURES GRID */}
        <Text style={styles.sectionTitle}>Detection Tools</Text>
        <View style={styles.gridContainer}>
          <FeatureCard title="Text Scan" icon="💬" color="#E3F2FD" textColor="#0056D2" onPress={() => handleNavigation('Text')} />
          <FeatureCard title="Image OCR" icon="🖼️" color="#F3F4F6" textColor="#555" onPress={() => handleNavigation('Image OCR')} />
          <FeatureCard title="Voice Check" icon="🎙️" color="#F3F4F6" textColor="#555" onPress={() => handleNavigation('Voice Analysis')} />
          <FeatureCard title="Deepfake" icon="🎥" color="#F3F4F6" textColor="#555" onPress={() => handleNavigation('Deepfake Detection')} />
        </View>

        {/* 4. ANALYTICS CAROUSEL */}
        <Text style={styles.sectionTitle}>Security Insights</Text>
        <FlatList
          data={chartsData}
          renderItem={renderChartItem}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled={true} 
          snapToInterval={screenWidth - 36} 
          decelerationRate="fast"
          contentContainerStyle={{ paddingBottom: 20 }}
        />

        {/* 5. RECENT ACTIVITY */}
        <Text style={styles.sectionTitle}>Recent Scans</Text>
        <View style={styles.historyList}>
          <HistoryItem type="Text" content="Urgent: Your bank account..." status="Safe" date="Today, 10:23 AM" />
          <HistoryItem type="SMS" content="Win $1000 now! Click here..." status="Risk" date="Yesterday" />
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* --- CUSTOM POPUP MODAL --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setModalVisible(false)}
        >
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <View style={styles.modalIconBox}>
                <Ionicons name="rocket" size={32} color="#0056D2" />
              </View>
              <Text style={styles.modalTitle}>Coming Soon!</Text>
              <Text style={styles.modalText}>
                The <Text style={{fontWeight:'bold'}}>{activeFeature}</Text> module is currently under development. Stay tuned for the next update!
              </Text>
              <TouchableOpacity 
                style={styles.modalButton} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Got it!</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>

    </SafeAreaView>
  );
}

// --- SUB-COMPONENTS ---

const FeatureCard = ({ title, icon, color, textColor, onPress }) => (
  <TouchableOpacity style={[styles.card, { backgroundColor: color }]} onPress={onPress} activeOpacity={0.7}>
    <Text style={styles.cardIcon}>{icon}</Text>
    <Text style={[styles.cardText, { color: textColor }]}>{title}</Text>
  </TouchableOpacity>
);

const HistoryItem = ({ type, content, status, date }) => (
  <View style={styles.historyItem}>
    <View style={styles.historyIconBox}>
      <Text style={{ fontSize: 20 }}>{type === 'Text' ? '📝' : type === 'SMS' ? '📱' : '📧'}</Text>
    </View>
    <View style={{ flex: 1, paddingHorizontal: 12 }}>
      <Text style={styles.historyTitle}>{type} Scan</Text>
      <Text style={styles.historyContent} numberOfLines={1}>{content}</Text>
      <Text style={styles.historyDate}>{date}</Text>
    </View>
    <View style={[styles.statusBadge, { backgroundColor: status === 'Safe' ? '#E8F5E9' : '#FFEBEE' }]}>
      <Text style={[styles.statusText, { color: status === 'Safe' ? '#2E7D32' : '#C62828' }]}>{status}</Text>
    </View>
  </View>
);

// --- STYLES ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F4F6F8' },
  scrollContainer: { padding: 24, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  greetingText: { fontSize: 22, fontWeight: '700', color: '#1A1A1A' },
  subGreeting: { fontSize: 14, color: '#666', marginTop: 2 },
  avatar: { width: 50, height: 50, borderRadius: 25, borderWidth: 2, borderColor: '#fff' },
  
  heroCard: {
    backgroundColor: '#0056D2', borderRadius: 20, padding: 24, marginBottom: 30,
    shadowColor: "#0056D2", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 12, elevation: 8,
  },
  heroContent: { alignItems: 'flex-start' },
  heroTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  heroSubtitle: { fontSize: 14, color: '#E3F2FD', marginBottom: 20, lineHeight: 20 },
  heroButton: { backgroundColor: '#fff', paddingVertical: 12, borderRadius: 12, alignItems: 'center', width: 140 },
  heroButtonText: { color: '#0056D2', fontWeight: 'bold', fontSize: 14 },
  
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#333', marginBottom: 16 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20 },
  card: { width: '48%', height: 110, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  cardIcon: { fontSize: 32, marginBottom: 8 },
  cardText: { fontSize: 14, fontWeight: '600' },
  
  chartCard: {
    backgroundColor: '#fff', borderRadius: 20, padding: 16, elevation: 2,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4,
  },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, paddingHorizontal: 4 },
  chartTitle: { fontSize: 16, fontWeight: '600', color: '#333' },
  badge: { backgroundColor: '#E3F2FD', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  badgeText: { fontSize: 12, color: '#0056D2', fontWeight: '600' },
  
  historyList: { backgroundColor: '#fff', borderRadius: 20, padding: 16 },
  historyItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  historyIconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center' },
  historyTitle: { fontSize: 14, fontWeight: '600', color: '#333' },
  historyContent: { fontSize: 12, color: '#666', marginTop: 2, maxWidth: 180 },
  historyDate: { fontSize: 10, color: '#999', marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: 'bold' },

  // --- MODAL STYLES ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    elevation: 5,
  },
  modalIconBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  modalText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  modalButton: {
    backgroundColor: '#0056D2',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});