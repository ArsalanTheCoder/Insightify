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
  NativeModules,
  NativeEventEmitter,
  Image,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Media Libraries
import { launchImageLibrary } from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';

import { analyzeText } from '../../services/scamApi';
import AccessibilitySetupBanner from '../../components/AccessibilitySetupBanner';

const { NotificationModule } = NativeModules;
const notificationEmitter = new NativeEventEmitter(NotificationModule);

// 🔒 LIMIT: 4MB (Safe for Hackathon Backend)
const MAX_FILE_SIZE = 4 * 1024 * 1024;

function hashStringToId(s) {
  if (!s) return 'no-id';
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h) + s.charCodeAt(i);
    h = h & 0xffffffff;
  }
  return String(h >>> 0);
}

const DetectScreen = ({ navigation, route }) => {
  // --- STATE ---
  const [inputText, setInputText] = useState('');

  // Two loading states: one for AI analysis, one for File Processing
  const [analyzing, setAnalyzing] = useState(false);
  const [processingFile, setProcessingFile] = useState(false);

  // Media State
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  // { uri, type: 'image'|'video'|'audio', base64, mimeType, name }

  // --- REFS (Original Logic) ---
  const lastPayloadIdRef = useRef(null);
  const lastProcessedAtRef = useRef(0);
  const autoAnalyzeRef = useRef(false);

  // --- Notification Logic ---
  const handlePayload = (payload, shouldAutoAnalyze = false) => {
    try {
      const data = typeof payload === 'string' ? JSON.parse(payload) : payload;
      if (!data) return;
      const text = data.text ?? data.autofillText ?? '';
      if (!text) return;
      const id = data.id ? String(data.id) : hashStringToId(text);
      const now = Date.now();
      if (now - lastProcessedAtRef.current < 800) {
        if (lastPayloadIdRef.current === id) return;
      }
      if (lastPayloadIdRef.current !== id) {
        setInputText(text);
        lastPayloadIdRef.current = id;
        lastProcessedAtRef.current = now;

        // Auto-trigger Gemini analysis for notification-sourced messages
        if (shouldAutoAnalyze) {
          autoAnalyzeRef.current = true;
        }
      }
    } catch (e) {
      console.warn('Invalid notification payload', e);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const launchPayload = await NotificationModule.getLaunchPayload();
        if (launchPayload) handlePayload(launchPayload, true);
      } catch (e) { console.warn('getLaunchPayload error', e); }
    })();
    const sub = notificationEmitter.addListener('NotificationReceived', (raw) => {
      handlePayload(raw, true);
    });
    return () => sub.remove();
  }, []);

  // Auto-analyze when text arrives from notification
  useEffect(() => {
    if (autoAnalyzeRef.current && inputText.trim().length > 0 && !analyzing) {
      autoAnalyzeRef.current = false;
      // Small delay to let the UI render with the pasted text first
      const timer = setTimeout(() => {
        handleAnalyzePress();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [inputText]);

  useEffect(() => {
    const navPayload = route?.params;
    if (!navPayload) return;
    if (navPayload.autofillText) {
      handlePayload({ text: navPayload.autofillText });
    } else {
      handlePayload(navPayload);
    }
  }, [route?.params]);


  /* ---------------- 🆕 ROBUST FILE HANDLERS ---------------- */

  // Helper to validate size
  const checkSize = (size) => {
    if (size && size > MAX_FILE_SIZE) {
      Alert.alert("File Too Large", "For this demo, please use files under 4MB.");
      return false;
    }
    return true;
  };

  const handlePickImage = () => {
    setMenuOpen(false);
    // Images are usually safe, but we limit quality to 0.5 to keep base64 small
    const options = { mediaType: 'photo', includeBase64: true, quality: 0.5 };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        Alert.alert('Error', response.errorMessage);
        return;
      }
      if (response.assets?.length > 0) {
        const asset = response.assets[0];

        if (!checkSize(asset.fileSize)) return;

        setSelectedMedia({
          uri: asset.uri,
          type: 'image',
          base64: asset.base64,
          mimeType: asset.type,
        });
      }
    });
  };

  const handlePickVideo = () => {
    setMenuOpen(false);
    const options = { mediaType: 'video', videoQuality: 'low' }; // Low quality for demo

    launchImageLibrary(options, async (response) => {
      if (response.didCancel) return;
      if (response.assets?.length > 0) {
        const asset = response.assets[0];

        if (!checkSize(asset.fileSize)) return;

        setProcessingFile(true); // Start Spinner
        try {
          // Read File
          const base64 = await RNFS.readFile(asset.uri, 'base64');

          setSelectedMedia({
            uri: asset.uri,
            type: 'video',
            base64: base64,
            mimeType: asset.type || 'video/mp4',
          });
        } catch (err) {
          Alert.alert("Video Error", "Could not process video.");
        } finally {
          setProcessingFile(false); // Stop Spinner
        }
      }
    });
  };

  const handlePickAudio = async () => {
    setMenuOpen(false);
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.audio],
        copyTo: 'cachesDirectory',
      });

      if (!checkSize(res.size)) return;

      setProcessingFile(true); // Start Spinner

      const uriToRead = res.fileCopyUri || res.uri;
      const base64 = await RNFS.readFile(uriToRead, 'base64');

      // Fix MIME type for Android
      let finalMime = res.type;
      if (!finalMime || finalMime === 'application/octet-stream') {
        if (res.name.endsWith('.mp3')) finalMime = 'audio/mp3';
        if (res.name.endsWith('.wav')) finalMime = 'audio/wav';
        if (res.name.endsWith('.m4a')) finalMime = 'audio/mp4';
      }

      setSelectedMedia({
        uri: res.uri,
        type: 'audio',
        name: res.name,
        base64: base64,
        mimeType: finalMime,
      });

    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        Alert.alert('Audio Error', 'Could not pick audio file');
      }
    } finally {
      setProcessingFile(false); // Stop Spinner
    }
  };

  const handleClearMedia = () => {
    setSelectedMedia(null);
  };

  /* ---------------- Main Actions ---------------- */

  const handleAnalyzePress = async () => {
    if (!inputText.trim() && !selectedMedia) {
      Alert.alert('Empty Input', 'Please paste text or select media.');
      return;
    }

    setAnalyzing(true);
    try {
      // Send both text and media to API
      const result = await analyzeText(inputText.trim(), selectedMedia);

      navigation.navigate('ResultScreen', {
        content: inputText,
        media: selectedMedia,
        result,
      });

      setInputText('');
      setSelectedMedia(null);

    } catch (error) {
      console.warn('Analyze error:', error);
      Alert.alert('Error', error?.message || 'Something went wrong.');
    } finally {
      setAnalyzing(false);
    }
  };

  // --- UI ---
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" translucent={false} />

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Header (Original) */}
        <View style={styles.topHeader}>
          <Text style={styles.topTitle}>Detect</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('HistoryScreen')}
            style={styles.historyBtn}
          >
            <Ionicons name="time-outline" size={18} color="#2563EB" />
            <Text style={styles.historyText}>History</Text>
          </TouchableOpacity>
        </View>

        {/* Hero */}
        <View style={styles.headerSection}>
          <View style={styles.iconCircle}>
            <Ionicons name="shield-checkmark" size={32} color="#2563EB" />
          </View>
          <Text style={styles.headerTitle}>AI Scam Analyzer</Text>
          <Text style={styles.headerSubtitle}>
            Paste suspicious SMS, Links, or upload Screenshots/Audio.{'\n'}
            Our Gemini AI will analyze it instantly.
          </Text>
        </View>

        {/* Accessibility Service Setup Banner */}
        <AccessibilitySetupBanner />

        {/* Media Preview Card */}
        {selectedMedia && (
          <View style={styles.mediaPreviewCard}>
            <View style={styles.mediaHeaderRow}>
              <Text style={styles.mediaTitle}>Ready to Analyze</Text>
              <TouchableOpacity onPress={handleClearMedia}>
                <Ionicons name="close-circle" size={24} color="#EF4444" />
              </TouchableOpacity>
            </View>

            {selectedMedia.type === 'image' && (
              <Image source={{ uri: selectedMedia.uri }} style={styles.previewImage} resizeMode="cover" />
            )}

            {selectedMedia.type === 'video' && (
              <View style={styles.filePlaceholder}>
                <Ionicons name="videocam" size={40} color="#F59E0B" />
                <Text style={styles.fileText}>Video File Selected</Text>
              </View>
            )}

            {selectedMedia.type === 'audio' && (
              <View style={styles.filePlaceholder}>
                <Ionicons name="musical-notes" size={40} color="#8B5CF6" />
                <Text style={styles.fileText}>{selectedMedia.name || "Audio File"}</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* --- INPUT BAR --- */}
      <View style={styles.bottomInputWrapper}>

        {/* Pop-up Menu */}
        {menuOpen && (
          <View style={styles.attachMenu}>
            <TouchableOpacity style={styles.menuItem} onPress={handlePickImage}>
              <View style={[styles.menuIcon, { backgroundColor: '#10B981' }]}>
                <Ionicons name="image" size={18} color="#fff" />
              </View>
              <Text style={styles.menuLabel}>Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handlePickVideo}>
              <View style={[styles.menuIcon, { backgroundColor: '#F59E0B' }]}>
                <Ionicons name="videocam" size={18} color="#fff" />
              </View>
              <Text style={styles.menuLabel}>Video (Short)</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handlePickAudio}>
              <View style={[styles.menuIcon, { backgroundColor: '#8B5CF6' }]}>
                <Ionicons name="musical-notes" size={18} color="#fff" />
              </View>
              <Text style={styles.menuLabel}>Audio</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.inputRow}>
          {/* (+) Button */}
          <TouchableOpacity
            style={[styles.plusButton, menuOpen && styles.plusButtonActive]}
            onPress={() => setMenuOpen(!menuOpen)}
          >
            <Ionicons name={menuOpen ? "close" : "add"} size={24} color="#555" />
          </TouchableOpacity>

          {/* Input Field */}
          <TextInput
            style={styles.chatInput}
            placeholder={processingFile ? "Processing file..." : "Check message, link, or scam..."}
            placeholderTextColor="#9CA3AF"
            multiline
            value={inputText}
            onChangeText={setInputText}
            editable={!processingFile} // Disable while processing
          />

          {/* Action Button */}
          {processingFile ? (
            <View style={styles.micButton}>
              <ActivityIndicator size="small" color="#2563EB" />
            </View>
          ) : (
            (inputText.length > 0 || selectedMedia) ? (
              <TouchableOpacity style={styles.sendButton} onPress={handleAnalyzePress} disabled={analyzing}>
                {analyzing ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Ionicons name="arrow-up" size={20} color="#fff" />
                )}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.micButton} onPress={() => Alert.alert('Voice', 'Use the (+) button to upload Audio files.')}>
                <Ionicons name="mic" size={24} color="#111" />
              </TouchableOpacity>
            )
          )}
        </View>
      </View>

    </KeyboardAvoidingView>
  );
};

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContainer: { padding: 20, paddingBottom: 100 },

  topHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  topTitle: { fontSize: 24, fontWeight: '800', color: '#1E293B' },
  historyBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EFF6FF', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20 },
  historyText: { marginLeft: 4, color: '#2563EB', fontWeight: '600', fontSize: 13 },

  headerSection: { alignItems: 'center', marginBottom: 20, backgroundColor: '#fff', padding: 20, borderRadius: 20, elevation: 1 },
  iconCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#DBEAFE', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#1E293B', marginBottom: 5 },
  headerSubtitle: { fontSize: 13, color: '#64748B', textAlign: 'center', lineHeight: 18 },

  mediaPreviewCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
  },
  mediaHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  mediaTitle: { fontWeight: '700', color: '#2563EB' },
  previewImage: { width: '100%', height: 200, borderRadius: 12, backgroundColor: '#f0f0f0' },
  filePlaceholder: { width: '100%', height: 120, borderRadius: 12, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  fileText: { marginTop: 10, color: '#475569', fontWeight: '600' },

  bottomInputWrapper: {
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  plusButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusButtonActive: {
    backgroundColor: '#E5E7EB',
    transform: [{ rotate: '45deg' }]
  },
  chatInput: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    color: '#1E293B',
    fontSize: 16,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  micButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },

  attachMenu: {
    position: 'absolute',
    bottom: 70,
    left: 12,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    width: 150,
    zIndex: 100,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  menuIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
});

export default DetectScreen;