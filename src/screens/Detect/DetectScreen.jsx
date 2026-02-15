import React, { useState } from 'react';
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
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Screen from '../../components/layout/Screen';

// Media Libraries
import { launchImageLibrary } from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';

import { analyzeText } from '../../services/scamApi';

// 🔒 LIMIT: 4MB
const MAX_FILE_SIZE = 4 * 1024 * 1024;

const DetectScreen = ({ navigation }) => {
  // --- STATE ---
  const [inputText, setInputText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [processingFile, setProcessingFile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);

  /* ---------------- FILE HELPERS ---------------- */

  const checkSize = (size) => {
    if (size && size > MAX_FILE_SIZE) {
      Alert.alert('File Too Large', 'Please use files under 4MB.');
      return false;
    }
    return true;
  };

  const handlePickImage = () => {
    setMenuOpen(false);
    launchImageLibrary(
      { mediaType: 'photo', includeBase64: true, quality: 0.5 },
      (res) => {
        if (res?.assets?.length) {
          const a = res.assets[0];
          if (!checkSize(a.fileSize)) return;
          setSelectedMedia({
            uri: a.uri,
            type: 'image',
            base64: a.base64,
            mimeType: a.type,
          });
        }
      }
    );
  };

  const handlePickVideo = () => {
    setMenuOpen(false);
    launchImageLibrary({ mediaType: 'video', videoQuality: 'low' }, async (res) => {
      if (res?.assets?.length) {
        const a = res.assets[0];
        if (!checkSize(a.fileSize)) return;
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

  const handleClearMedia = () => setSelectedMedia(null);

  /* ---------------- MAIN ACTION ---------------- */

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

  /* ---------------- UI ---------------- */

  return (
    <Screen padded edges={['top', 'bottom']} backgroundColor="#F8FAFF">
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#EFF6FF" />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.topHeader}>
          <Text style={styles.topTitle}>Detect</Text>
          <TouchableOpacity onPress={() => navigation.navigate('HistoryScreen')} style={styles.historyBtn}>
            <Ionicons name="time-outline" size={18} color="#2563EB" />
            <Text style={styles.historyText}>History</Text>
          </TouchableOpacity>
        </View>

        {/* Hero */}
        <View style={styles.headerSection}>
          <View style={styles.iconCircle}>
            <Ionicons name="shield-checkmark" size={30} color="#FFFFFF" />
          </View>
          <Text style={styles.headerTitle}>AI Scam Analyzer</Text>
          <Text style={styles.headerSubtitle}>
            Paste suspicious messages or upload files to analyze.
          </Text>
        </View>

        {/* Media Preview */}
        {selectedMedia && (
          <View style={styles.mediaPreviewCard}>
            <View style={styles.mediaHeaderRow}>
              <Text style={styles.mediaTitle}>Ready to Analyze</Text>
              <TouchableOpacity onPress={handleClearMedia}>
                <Ionicons name="close-circle" size={24} color="#EF4444" />
              </TouchableOpacity>
            </View>

            {selectedMedia.type === 'image' && (
              <Image source={{ uri: selectedMedia.uri }} style={styles.previewImage} />
            )}

            {selectedMedia.type !== 'image' && (
              <View style={styles.filePlaceholder}>
                <Ionicons name="document" size={40} color="#64748B" />
                <Text style={styles.fileText}>{selectedMedia.name || 'File Selected'}</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Bottom Input */}
      <View style={styles.bottomInputWrapper}>
        {menuOpen && (
          <View style={styles.attachMenu}>
            <TouchableOpacity style={styles.menuItem} onPress={handlePickImage}>
              <Ionicons name="image" size={18} color="#10B981" />
              <Text style={styles.menuLabel}>Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handlePickVideo}>
              <Ionicons name="videocam" size={18} color="#F59E0B" />
              <Text style={styles.menuLabel}>Video</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handlePickAudio}>
              <Ionicons name="musical-notes" size={18} color="#8B5CF6" />
              <Text style={styles.menuLabel}>Audio</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.inputRow}>
          <TouchableOpacity style={styles.plusButton} onPress={() => setMenuOpen(!menuOpen)}>
            <Ionicons name={menuOpen ? 'close' : 'add'} size={22} />
          </TouchableOpacity>

          <TextInput
            style={styles.chatInput}
            placeholder="Check message, link, or scam..."
            multiline
            value={inputText}
            onChangeText={setInputText}
          />

          <TouchableOpacity style={styles.sendButton} onPress={handleAnalyzePress} disabled={analyzing}>
            {analyzing ? <ActivityIndicator color="#fff" /> : <Ionicons name="arrow-up" size={18} color="#fff" />}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
    </Screen>
  );
};

export default DetectScreen;


/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContainer: { paddingTop: 20, paddingBottom: 100 }, 

  topHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  topTitle: { fontSize: 24, fontWeight: '800', color: '#1E293B' },
  historyBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EFF6FF', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20 },
  historyText: { marginLeft: 4, color: '#2563EB', fontWeight: '600', fontSize: 13 },

  headerSection: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#2563EB', // theme blue
    padding: 22,
    borderRadius: 24,
    shadowColor: '#2563EB',
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 6,
  },
  iconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
  },

  headerSubtitle: {
    fontSize: 13,
    color: '#DBEAFE',
    textAlign: 'center',
    lineHeight: 18,
  },
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
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 2,  
    paddingVertical: 10,
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
    left: 16,
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
