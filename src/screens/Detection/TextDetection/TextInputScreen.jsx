import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform, Alert,
  ActivityIndicator
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// 👇 IMPORT THE NEW GEMINI SERVICE
import { analyzeTextWithGemini } from '../../../services/GeminiService';

const TextInputScreen = ({ navigation }) => {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  // Function to Clear Text
  const handleClear = () => {
    setInputText('');
  };

  const handleAnalyzePress = async () => {
    if (inputText.trim().length === 0) {
      Alert.alert('Empty Input', 'Please paste some text or a URL to analyze.');
      return;
    }

    setLoading(true);

    try {
      // 1. Call Gemini
      const result = await analyzeTextWithGemini(inputText);

      // 2. Navigate to Result Screen with AI Data
      navigation.navigate('TextResultScreen', { 
        content: inputText, 
        result: result 
      });

    } catch (error) {
      Alert.alert("Error", "Something went wrong during the AI scan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
        // 👇 THIS FIXES THE DOUBLE CLICK ISSUE
        keyboardShouldPersistTaps="handled" 
      >
        
        {/* Header */}
        <View style={styles.headerSection}>
          <View style={styles.iconCircle}>
            <Ionicons name="sparkles" size={32} color="#2563EB" /> 
          </View>
          <Text style={styles.headerTitle}>AI Scam Analyzer</Text>
          <Text style={styles.headerSubtitle}>
            Powered by Google Gemini.{'\n'}Detects Emails, SMS & Phishing.
          </Text>
        </View>

        {/* Input Container */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Paste suspicious SMS, Email, or Link..."
            placeholderTextColor="#9CA3AF"
            multiline
            textAlignVertical="top"
            value={inputText}
            onChangeText={setInputText}
          />
          
          {/* 👇 NEW CLEAR BUTTON (Only shows when there is text) */}
          {inputText.length > 0 && (
            <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
               <Ionicons name="close-circle" size={18} color="#EF4444" />
               <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Analyze Button */}
        <TouchableOpacity 
          style={[styles.analyzeButton, loading && { backgroundColor: '#93C5FD' }]} 
          onPress={handleAnalyzePress} 
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
             <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <ActivityIndicator size="small" color="#fff" style={{marginRight: 10}}/>
                <Text style={styles.analyzeButtonText}>Analyzing...</Text>
             </View>
          ) : (
             <Text style={styles.analyzeButtonText}>Analyze Message</Text>
          )}
        </TouchableOpacity>

        {/* Help Card */}
        <View style={styles.communityCard}>
          <Text style={styles.communityTitle}>Help Others Stay Safe</Text>
          <Text style={styles.communitySubtitle}>Share to Community Feed?</Text>
          <View style={styles.communityButtonContainer}>
            <TouchableOpacity style={styles.skipButton}><Text style={styles.skipButtonText}>Skip</Text></TouchableOpacity>
            <TouchableOpacity style={styles.shareButton}><Text style={styles.shareButtonText}>Share</Text></TouchableOpacity>
          </View>
        </View>
        <View style={{ height: 30 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  scrollContainer: { padding: 20, paddingTop: 40 },
  
  headerSection: { alignItems: 'center', marginBottom: 24, backgroundColor: '#EFF6FF', padding: 24, borderRadius: 24 },
  iconCircle: { width: 64, height: 64, borderRadius: 32, borderWidth: 3, borderColor: '#2563EB', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', marginBottom: 12 },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#111827', marginBottom: 8 },
  headerSubtitle: { textAlign: 'center', color: '#6B7280', fontSize: 14, lineHeight: 20 },
  
  // Updated Input Container to handle relative positioning of Clear button
  inputContainer: { width: '100%', height: 250, backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: '#E5E7EB', elevation: 2, position: 'relative' },
  textInput: { flex: 1, fontSize: 16, color: '#374151', paddingBottom: 40 }, // Added padding bottom to avoid text hitting clear button
  
  // Styles for Clear Button
  clearButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2', // Light red background
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  clearButtonText: {
    color: '#EF4444',
    fontWeight: '600',
    fontSize: 12,
    marginLeft: 4,
  },

  analyzeButton: { width: '100%', backgroundColor: '#2563EB', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginBottom: 24, elevation: 4 },
  analyzeButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  
  communityCard: { width: '100%', backgroundColor: '#fff', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#E5E7EB' },
  communityTitle: { fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 4 },
  communitySubtitle: { fontSize: 13, color: '#6B7280', marginBottom: 20 },
  communityButtonContainer: { flexDirection: 'row' },
  skipButton: { flex: 1, backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#3B82F6', paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginRight: 10 },
  skipButtonText: { color: '#3B82F6', fontWeight: '600' },
  shareButton: { flex: 1.5, backgroundColor: '#F59E0B', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  shareButtonText: { color: '#fff', fontWeight: '600' },
});

export default TextInputScreen;