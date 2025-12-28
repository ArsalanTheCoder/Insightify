import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const TextResultScreen = ({ route, navigation }) => {
  const { content, result } = route.params || {};
  
  // Default data in case of error
  const data = result || {
    isScam: false,
    score: 0,
    verdict: 'Analysis Pending',
    summary: 'No data returned.',
    action: 'Try again',
    keyFindings: [],
  };

  // Dynamic Styles based on AI Risk Score
  const isHighRisk = data.isScam;
  const statusColor = isHighRisk ? '#D32F2F' : '#2E7D32'; 
  const statusBgColor = isHighRisk ? '#FFEBEE' : '#E8F5E9';
  const statusIcon = isHighRisk ? 'warning' : 'checkmark-circle';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
           <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>AI Analysis Result</Text>
        <View style={{width: 24}} /> 
      </View>

      {/* 1. VERDICT CARD */}
      <View style={[styles.verdictCard, { backgroundColor: statusBgColor }]}>
        <Ionicons name={statusIcon} size={60} color={statusColor} />
        
        <Text style={[styles.verdictTitle, { color: statusColor }]}>{data.verdict}</Text>
        
        <Text style={styles.riskScoreText}>Risk Score: {data.score}/100</Text>
        
        {/* Progress Bar */}
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${data.score}%`, backgroundColor: statusColor }]} />
        </View>

        {/* Action Advice (NEW) */}
        <View style={[styles.actionBadge, { borderColor: statusColor }]}>
           <Text style={[styles.actionText, { color: statusColor }]}>Recommendation: {data.action}</Text>
        </View>
      </View>

      {/* 2. SUMMARY SECTION */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Why is this {isHighRisk ? 'unsafe' : 'safe'}?</Text>
        <Text style={styles.summaryText}>{data.summary}</Text>
      </View>

      {/* 3. KEY FINDINGS */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Key Findings</Text>
        {data.keyFindings && data.keyFindings.length > 0 ? (
          data.keyFindings.map((finding, index) => (
            <View key={index} style={styles.findingItem}>
               <View style={[styles.findingIconBox, { backgroundColor: statusBgColor }]}>
                  <Ionicons name={isHighRisk ? "alert-circle" : "shield-checkmark"} size={20} color={statusColor} />
               </View>
               <Text style={styles.findingText}>{finding.text}</Text>
            </View>
          ))
        ) : (
          <Text style={{color: '#999', fontStyle: 'italic'}}>No specific patterns detected.</Text>
        )}
      </View>

      {/* 4. CONTENT PREVIEW */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Analyzed Content</Text>
        <View style={styles.contentPreviewBox}>
           <Text style={styles.previewText} numberOfLines={5}>"{content}"</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.goBack()} activeOpacity={0.9}>
        <Text style={styles.primaryButtonText}>Scan Another Message</Text>
      </TouchableOpacity>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  scrollContent: { padding: 20 },
  topBar: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  topBarTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  backButton: { padding: 5 },
  
  verdictCard: { borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 24, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
  verdictTitle: { fontSize: 24, fontWeight: 'bold', marginTop: 12, marginBottom: 4 },
  riskScoreText: { fontSize: 14, color: '#555', marginBottom: 16 },
  progressBarBg: { width: '100%', height: 10, backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 5, overflow: 'hidden', marginBottom: 16 },
  progressBarFill: { height: '100%', borderRadius: 5 },
  
  actionBadge: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1, marginTop: 5, backgroundColor: '#fff' },
  actionText: { fontWeight: '700', fontSize: 14 },

  sectionContainer: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 16, elevation: 1 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  summaryText: { fontSize: 15, lineHeight: 22, color: '#555' },
  
  findingItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  findingIconBox: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  findingText: { fontSize: 15, color: '#444', flex: 1 },
  
  contentPreviewBox: { backgroundColor: '#F5F5F5', padding: 12, borderRadius: 8, borderLeftWidth: 4, borderLeftColor: '#BDBDBD' },
  previewText: { fontStyle: 'italic', color: '#666' },
  
  primaryButton: { backgroundColor: '#2196F3', paddingVertical: 16, borderRadius: 12, alignItems: 'center', elevation: 2 },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default TextResultScreen;