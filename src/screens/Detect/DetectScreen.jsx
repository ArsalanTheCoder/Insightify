// src/screens/Detect/DetectScreen.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  StatusBar,
  Image,
  SafeAreaView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

import { launchImageLibrary } from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';

import { analyzeText } from '../../services/scamApi';
import AccessibilitySetupBanner from '../../components/AccessibilitySetupBanner';

// 🔒 LIMIT: 4MB
const MAX_FILE_SIZE = 4 * 1024 * 1024;

function hashStringToId(s) {
  if (!s) {return 'no-id';}
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h) + s.charCodeAt(i);
    h &= 0xffffffff;
  }
  return String(h >>> 0);
}

/* ───────────── QUICK SCAN TYPES ───────────── */

const SCAN_TYPES = [
  { id: 'text', label: 'Text', icon: 'chatbox-ellipses-outline', color: '#0056D2', bg: '#EFF6FF' },
  { id: 'email', label: 'Email', icon: 'mail-outline', color: '#7C3AED', bg: '#F5F3FF' },
  { id: 'image', label: 'Image', icon: 'image-outline', color: '#059669', bg: '#ECFDF5' },
  { id: 'video', label: 'Video', icon: 'videocam-outline', color: '#DC2626', bg: '#FEF2F2' },
  { id: 'audio', label: 'Audio', icon: 'mic-outline', color: '#EA580C', bg: '#FFF7ED' },
];

const DetectScreen = ({ navigation, route }) => {
  const [inputText, setInputText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [processingFile, setProcessingFile] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);

  const lastPayloadIdRef = useRef(null);

  /* ───────────── ROUTE PAYLOAD (FROM App.jsx) ───────────── */

  useEffect(() => {
    const payload = route?.params;
    if (!payload?.autofillText && !payload?.text) {return;}

    const text = payload.autofillText || payload.text;
    const id = hashStringToId(text);

    if (lastPayloadIdRef.current === id) {return;}

    lastPayloadIdRef.current = id;
    setInputText(text);
  }, [route?.params]);

  /* ───────────── FILE HELPERS ───────────── */

  const checkSize = (size) => {
    if (size && size > MAX_FILE_SIZE) {
      Alert.alert('File Too Large', 'Please use files under 4MB.');
      return false;
    }
    return true;
  };

  const handlePickImage = () => {
    launchImageLibrary(
      { mediaType: 'photo', includeBase64: true, quality: 0.5 },
      (res) => {
        if (res?.assets?.length) {
          const a = res.assets[0];
          if (!checkSize(a.fileSize)) {return;}
          setSelectedMedia({
            uri: a.uri,
            type: 'image',
            base64: a.base64,
            mimeType: a.type,
          });
        }
      },
    );
  };

  const handlePickVideo = () => {
    launchImageLibrary(
      { mediaType: 'video', videoQuality: 'low' },
      async (res) => {
        if (!res?.assets?.length) {return;}
        const a = res.assets[0];
        if (!checkSize(a.fileSize)) {return;}

        setProcessingFile(true);
        try {
          const base64 = await RNFS.readFile(a.uri, 'base64');
          setSelectedMedia({
            uri: a.uri,
            type: 'video',
            base64,
            mimeType: a.type || 'video/mp4',
          });
        } catch {
          Alert.alert('Video Error', 'Could not process video.');
        } finally {
          setProcessingFile(false);
        }
      },
    );
  };

  const handlePickAudio = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.audio],
        copyTo: 'cachesDirectory',
      });

      if (!checkSize(res.size)) {return;}

      setProcessingFile(true);
      const uri = res.fileCopyUri || res.uri;
      const base64 = await RNFS.readFile(uri, 'base64');

      setSelectedMedia({
        uri: res.uri,
        type: 'audio',
        name: res.name,
        base64,
        mimeType: res.type || 'audio/mp3',
      });
    } catch (e) {
      if (!DocumentPicker.isCancel(e)) {
        Alert.alert('Audio Error', 'Could not pick audio file.');
      }
    } finally {
      setProcessingFile(false);
    }
  };

  const handlePickEmail = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.plainText, DocumentPicker.types.pdf],
        copyTo: 'cachesDirectory',
      });

      if (!checkSize(res.size)) {return;}

      setProcessingFile(true);
      const uri = res.fileCopyUri || res.uri;

      if (res.type === 'text/plain') {
        const textContent = await RNFS.readFile(uri, 'utf8');
        setInputText(textContent);
      } else {
        const base64 = await RNFS.readFile(uri, 'base64');
        setSelectedMedia({
          uri: res.uri,
          type: 'document',
          name: res.name,
          base64,
          mimeType: res.type || 'application/pdf',
        });
      }
    } catch (e) {
      if (!DocumentPicker.isCancel(e)) {
        Alert.alert('Document Error', 'Could not pick document.');
      }
    } finally {
      setProcessingFile(false);
    }
  };

  const handleQuickScan = (scanId) => {
    switch (scanId) {
      case 'text':
        // Focus the text input — user types/pastes
        break;
      case 'email':
        handlePickEmail();
        break;
      case 'image':
        handlePickImage();
        break;
      case 'video':
        handlePickVideo();
        break;
      case 'audio':
        handlePickAudio();
        break;
    }
  };

  const handleAnalyzePress = async () => {
    if (!inputText.trim() && !selectedMedia) {
      Alert.alert('Empty Input', 'Please paste text or select media.');
      return;
    }

    setAnalyzing(true);
    try {
      const result = await analyzeText(inputText.trim(), selectedMedia);
      navigation.navigate('ResultScreen', {
        content: inputText,
        media: selectedMedia,
        result,
      });
      setInputText('');
      setSelectedMedia(null);
    } catch (e) {
      Alert.alert('Error', e?.message || 'Something went wrong.');
    } finally {
      setAnalyzing(false);
    }
  };

  /* ───────────── UI ───────────── */

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex1}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── HEADER ── */}
          <View style={styles.topHeader}>
            <View>
              <Text style={styles.topTitle}>Detect</Text>
              <Text style={styles.topSub}>AI-Powered Scam Shield</Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('HistoryScreen')}
              style={styles.historyBtn}
            >
              <Ionicons name="time-outline" size={16} color="#0056D2" />
              <Text style={styles.historyText}>History</Text>
            </TouchableOpacity>
          </View>

          {/* ── HERO CARD ── */}
          <LinearGradient
            colors={['#0056D2', '#0284C7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroCard}
          >
            <View style={styles.heroIconCircle}>
              <Ionicons name="shield-checkmark" size={28} color="#0056D2" />
            </View>
            <Text style={styles.heroTitle}>AI Scam Analyzer</Text>
            <Text style={styles.heroSub}>
              Paste suspicious text, URLs, or upload media to scan for threats
            </Text>
          </LinearGradient>

          {/* ── ACCESSIBILITY BANNER ── */}
          <AccessibilitySetupBanner />

          {/* ── QUICK SCAN TYPES ── */}
          <Text style={styles.sectionLabel}>Quick Scan</Text>
          <View style={styles.scanTypeRow}>
            {SCAN_TYPES.map((item) => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.75}
                onPress={() => handleQuickScan(item.id)}
                style={[styles.scanTypeCard, { backgroundColor: item.bg, borderColor: item.bg }]}
              >
                <View style={[styles.scanTypeIcon, { backgroundColor: item.color }]}>
                  <Ionicons name={item.icon} size={18} color="#FFFFFF" />
                </View>
                <Text style={[styles.scanTypeLabel, { color: item.color }]}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── MEDIA PREVIEW (when selected) ── */}
          {processingFile && (
            <View style={styles.processingCard}>
              <ActivityIndicator size="small" color="#0056D2" />
              <Text style={styles.processingText}>Processing file...</Text>
            </View>
          )}

          {selectedMedia && (
            <View style={styles.mediaPreviewCard}>
              <View style={styles.mediaHeaderRow}>
                <View style={styles.mediaLabelRow}>
                  <Ionicons name="checkmark-circle" size={18} color="#059669" />
                  <Text style={styles.mediaTitle}>Ready to Analyze</Text>
                </View>
                <TouchableOpacity onPress={() => setSelectedMedia(null)}>
                  <Ionicons name="close-circle" size={22} color="#EF4444" />
                </TouchableOpacity>
              </View>

              {selectedMedia.type === 'image' && (
                <Image
                  source={{ uri: selectedMedia.uri }}
                  style={styles.previewImage}
                />
              )}

              {selectedMedia.type !== 'image' && (
                <View style={styles.filePlaceholder}>
                  <Ionicons
                    name={
                      selectedMedia.type === 'audio' ? 'musical-notes' :
                      selectedMedia.type === 'video' ? 'videocam' : 'document'
                    }
                    size={32}
                    color="#64748B"
                  />
                  <Text style={styles.fileText}>
                    {selectedMedia.name || `${selectedMedia.type} selected`}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* ── TEXT INPUT AREA ── */}
          <Text style={styles.sectionLabel}>Message to Analyze</Text>
          <View style={styles.inputCard}>
            <TextInput
              style={styles.textInput}
              placeholder="Paste or type the suspicious message, URL, or email content here..."
              placeholderTextColor="#94A3B8"
              multiline
              textAlignVertical="top"
              value={inputText}
              onChangeText={setInputText}
            />

            {/* Character count */}
            <View style={styles.inputFooter}>
              <Text style={styles.charCount}>
                {inputText.length > 0 ? `${inputText.length} characters` : 'Supports text, URLs & email content'}
              </Text>
              {inputText.length > 0 && (
                <TouchableOpacity onPress={() => setInputText('')}>
                  <Ionicons name="close-circle" size={18} color="#94A3B8" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* ── ANALYZE BUTTON ── */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleAnalyzePress}
            disabled={analyzing}
            style={styles.analyzeBtn}
          >
            <LinearGradient
              colors={analyzing ? ['#94A3B8', '#94A3B8'] : ['#0056D2', '#0284C7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.analyzeBtnGradient}
            >
              {analyzing ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Ionicons name="shield-checkmark" size={20} color="#FFFFFF" />
                  <Text style={styles.analyzeBtnText}>Analyze Now</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Bottom spacer for floating tab bar */}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default DetectScreen;

/* ───────────── STYLES ───────────── */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  flex1: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },

  /* HEADER */
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  topTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0F172A',
  },
  topSub: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 1,
  },
  historyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    gap: 4,
  },
  historyText: {
    color: '#0056D2',
    fontWeight: '700',
    fontSize: 13,
  },

  /* HERO */
  heroCard: {
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#0056D2',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  heroIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  heroSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: 18,
  },

  /* SECTION LABEL */
  sectionLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
    marginTop: 6,
  },

  /* QUICK SCAN TYPES */
  scanTypeRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  scanTypeCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    elevation: 1,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
  scanTypeIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  scanTypeLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    textAlign: 'center',
  },

  /* PROCESSING */
  processingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  processingText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0056D2',
  },

  /* MEDIA PREVIEW */
  mediaPreviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 1,
  },
  mediaHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  mediaLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  mediaTitle: {
    fontWeight: '700',
    color: '#059669',
    fontSize: 13,
  },
  previewImage: {
    width: '100%',
    height: 160,
    borderRadius: 14,
  },
  filePlaceholder: {
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
  },
  fileText: {
    marginTop: 6,
    color: '#475569',
    fontWeight: '600',
    fontSize: 12,
  },

  /* TEXT INPUT */
  inputCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 16,
    elevation: 1,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  textInput: {
    fontSize: 14,
    color: '#0F172A',
    lineHeight: 20,
    minHeight: 140,
    maxHeight: 220,
    fontWeight: '500',
    padding: 0,
  },
  inputFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
    marginTop: 10,
  },
  charCount: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },

  /* ANALYZE BUTTON */
  analyzeBtn: {
    marginBottom: 10,
  },
  analyzeBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 18,
    gap: 8,
    elevation: 4,
    shadowColor: '#0056D2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  analyzeBtnText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },

  /* BOTTOM SPACER */
  bottomSpacer: {
    height: 90,
  },
});
