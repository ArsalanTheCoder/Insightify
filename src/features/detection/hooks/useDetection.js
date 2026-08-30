/**
 * Insightify — useDetection (Hook)
 *
 * Coordinates scan submission, validation, mode selection, native media pickers,
 * and navigation to ResultScreen.
 *
 * docs/RFC/RFC-004-F-detection-and-scan-history.md section 10
 */

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { useDetectionStore } from '../store/detectionStore';
import { submitScanAnalysis } from '../services/detectionApi';
import { pickImage, pickVideo, pickAudio } from '../utils/mediaPicker';

export function useDetection() {
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const {
    activeMode,
    inputContent,
    attachment,
    setActiveMode,
    setInputContent,
    setAttachment,
    clearAttachment,
    resetInput,
  } = useDetectionStore();

  const [validationError, setValidationError] = useState(null);

  const scanMutation = useMutation({
    mutationFn: submitScanAnalysis,
    onSuccess: (resultData) => {
      queryClient.invalidateQueries({ queryKey: ['detection', 'history'] });
      resetInput();
      navigation.navigate('ScanResult', {
        resultId: resultData.id,
        resultData,
      });
    },
  });

  /**
   * Launch appropriate native picker based on active mode
   */
  const handlePickMedia = async (targetMode = activeMode) => {
    let picked = null;
    if (targetMode === 'image') {
      picked = await pickImage();
    } else if (targetMode === 'video') {
      picked = await pickVideo();
    } else if (targetMode === 'audio') {
      picked = await pickAudio();
    }

    if (picked) {
      setAttachment(picked);
      if (validationError) {
        setValidationError(null);
      }
    }
  };

  /**
   * Handle mode selection from QuickScanSelector
   * For Image, Video, and Audio: automatically prompts native picker if no file selected
   */
  const handleSelectMode = async (mode) => {
    setActiveMode(mode);
    if (validationError) {
      setValidationError(null);
    }

    if (mode === 'image' || mode === 'video' || mode === 'audio') {
      // If switching to media mode and no media is selected yet, launch picker
      if (!attachment || attachment.type !== mode) {
        await handlePickMedia(mode);
      }
    }
  };

  /**
   * Validate and submit for analysis
   */
  const handleAnalyze = () => {
    const isTextBased = activeMode === 'text' || activeMode === 'email';

    if (isTextBased) {
      const trimmed = (inputContent || '').trim();
      if (!trimmed) {
        setValidationError(`Please enter ${activeMode === 'email' ? 'email content' : 'text or URL'} to analyze.`);
        return;
      }
      setValidationError(null);
      scanMutation.mutate({
        mode: activeMode,
        content: trimmed,
        attachment: null,
      });
    } else {
      if (!attachment) {
        setValidationError(`Please select an ${activeMode} file to analyze.`);
        return;
      }
      setValidationError(null);
      scanMutation.mutate({
        mode: activeMode,
        content: attachment.name,
        attachment,
      });
    }
  };

  return {
    activeMode,
    setActiveMode: handleSelectMode,
    inputContent,
    setInputContent: (text) => {
      setInputContent(text);
      if (validationError) {
        setValidationError(null);
      }
    },
    attachment,
    handlePickMedia,
    clearAttachment,
    handleAnalyze,
    isAnalyzing: scanMutation.isPending,
    validationError,
  };
}
