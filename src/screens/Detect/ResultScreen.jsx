import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Animated,
  Easing,
  Image,
  Share,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Screen from '../../components/layout/Screen';

const { width } = Dimensions.get('window');

export default function ResultScreen({ route, navigation }) {
  // 1. GET DATA (Text + Media)
  const { result, content, media } = route.params || {};
  
  // 2. SMART SCORE FIX (Handles 0-1 or 0-100 automatically)
  const rawScore = result?.score ?? 0;
  const score = rawScore <= 1 ? Math.round(rawScore * 100) : Math.round(rawScore);
  
  const reason = result?.reason || 'No specific explanation provided by AI.';
  const riskLevel = result?.risk || (score > 70 ? "Dangerous" : score > 30 ? "Suspicious" : "Safe");

  /* ---------------- ANIMATIONS ---------------- */
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: score,
      duration: 1200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      delay: 300,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [score]);

  /* ---------------- DYNAMIC THEME ---------------- */
  let theme = {
    label: 'SAFE',
    color: '#16A34A', // Green
    bg: '#F0FDF4',
    icon: 'shield-checkmark',
    advice: 'No threats detected. You can proceed safely.',
  };

  if (score >= 75) {
    theme = {
      label: 'DANGEROUS',
      color: '#DC2626', // Red
      bg: '#FEF2F2',
      icon: 'alert-circle',
      advice: 'Do NOT click any links. Block this sender immediately.',
    };
  } else if (score >= 40) {
    theme = {
      label: 'SUSPICIOUS',
      color: '#D97706', // Orange
      bg: '#FFFBEB',
      icon: 'warning',
      advice: 'Be careful. Verify the source before replying.',
    };
  }

  const animatedWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  const handleShare = async () => {
    try {
      await Share.share({
        message: `🚨 Insightify Scan Result: This content is ${score}% ${theme.label}. ${reason}`,
      });
    } catch (error) { console.log(error); }
  };

  /* ---------------- UI ---------------- */
  return (
    <Screen>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analysis Report</Text>
        <TouchableOpacity onPress={handleShare} style={styles.iconBtn}>
          <Ionicons name="share-social-outline" size={24} color="#1E293B" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        
        {/* 1. MAIN SCORE CARD */}
        <View style={[styles.card, { backgroundColor: theme.bg, borderColor: theme.color }]}>
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <Ionicons name={theme.icon} size={64} color={theme.color} style={{ marginBottom: 10 }} />
          </Animated.View>

          <Text style={[styles.riskLabel, { color: theme.color }]}>{theme.label}</Text>

          <View style={styles.scoreRow}>
             <Animated.Text style={[styles.score, { color: theme.color }]}>
               {score}%
             </Animated.Text>
             <Text style={styles.scoreSuffix}> Risk Score</Text>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, { width: animatedWidth, backgroundColor: theme.color }]} />
          </View>

          <Text style={styles.adviceText}>{theme.advice}</Text>
        </View>

        {/* 2. GEMINI ANALYSIS */}
        <View style={styles.sectionBox}>
          <View style={styles.sectionHeader}>
             <Ionicons name="sparkles" size={18} color="#7C3AED" />
             <Text style={styles.sectionTitle}>Gemini 3 Analysis</Text>
          </View>
          <Text style={styles.reasonText}>{reason}</Text>
        </View>

        {/* 3. SCANNED EVIDENCE (Crucial for Multimodal) */}
        <View style={styles.sectionBox}>
           <View style={styles.sectionHeader}>
             <Ionicons name="eye-outline" size={18} color="#475569" />
             <Text style={styles.sectionTitle}>Evidence Scanned</Text>
           </View>

           {/* IF TEXT */}
           {content ? (
             <View style={styles.evidenceContent}>
                <Text style={styles.evidenceLabel}>TEXT:</Text>
                <Text style={styles.evidenceText} numberOfLines={3}>{content}</Text>
             </View>
           ) : null}

           {/* IF IMAGE */}
           {media && media.type === 'image' && (
             <View style={styles.evidenceContent}>
                <Text style={styles.evidenceLabel}>IMAGE:</Text>
                <Image source={{ uri: media.uri }} style={styles.evidenceImage} resizeMode="cover" />
             </View>
           )}

           {/* IF VIDEO / AUDIO */}
           {media && (media.type === 'video' || media.type === 'audio') && (
             <View style={styles.evidenceContent}>
                <Text style={styles.evidenceLabel}>{media.type.toUpperCase()}:</Text>
                <View style={styles.fileBadge}>
                   <Ionicons name={media.type === 'video' ? 'videocam' : 'mic'} size={24} color="#64748B" />
                   <Text style={styles.fileName}>{media.type} content analyzed</Text>
                </View>
             </View>
           )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FOOTER ACTIONS */}
      <View style={styles.footer}>
        <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: theme.color }]} onPress={() => navigation.goBack()}>
          <Text style={styles.primaryBtnText}>Done</Text>
        </TouchableOpacity>
        
        {/* Only show "Report" if it is actually risky */}
        {score > 30 && (
            <TouchableOpacity 
              style={styles.secondaryBtn}
              onPress={() => navigation.navigate('Report', { screen: 'ReportHome' })}
            >
              <Text style={styles.secondaryBtnText}>Report to Database</Text>
            </TouchableOpacity>
        )}
      </View>
    </Screen>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },

  header: {
    height: 60,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
  iconBtn: { padding: 8 },

  scroll: { padding: 20 },

  // Score Card
  card: {
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  riskLabel: { fontSize: 18, fontWeight: '900', letterSpacing: 2, marginBottom: 5 },
  scoreRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 15 },
  score: { fontSize: 48, fontWeight: '900' },
  scoreSuffix: { fontSize: 16, color: '#64748B', fontWeight: '600' },
  
  progressTrack: {
    height: 10,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 15,
  },
  progressFill: { height: '100%', borderRadius: 10 },
  adviceText: { textAlign: 'center', color: '#334155', fontSize: 14, fontWeight: '500', lineHeight: 20 },

  // Generic Sections
  sectionBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 1,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1E293B', marginLeft: 8 },
  reasonText: { fontSize: 15, color: '#334155', lineHeight: 24 },

  // Evidence Styles
  evidenceContent: { backgroundColor: '#F8FAFC', padding: 12, borderRadius: 12, marginTop: 5 },
  evidenceLabel: { fontSize: 11, fontWeight: '700', color: '#94A3B8', marginBottom: 6 },
  evidenceText: { fontSize: 14, color: '#334155', fontStyle: 'italic' },
  evidenceImage: { width: '100%', height: 180, borderRadius: 8, marginTop: 5 },
  fileBadge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 20, backgroundColor: '#E2E8F0', borderRadius: 8 },
  fileName: { marginLeft: 10, color: '#475569', fontWeight: '600' },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    flexDirection: 'row',
    gap: 15,
  },
  primaryBtn: { flex: 1, paddingVertical: 16, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  secondaryBtn: { flex: 1, paddingVertical: 16, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#CBD5E1' },
  secondaryBtnText: { color: '#475569', fontWeight: '700', fontSize: 16 },
});