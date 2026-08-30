/**
 * Insightify — Detection Store (Zustand)
 *
 * Manages active scan mode, text input draft, and attached files.
 *
 * docs/RFC/RFC-004-F-detection-and-scan-history.md section 10
 */

import { create } from 'zustand';

export const useDetectionStore = create((set) => ({
  activeMode: 'text', // 'text' | 'email' | 'image' | 'video' | 'audio'
  inputContent: '',
  attachment: null, // { uri, name, type, size }

  setActiveMode: (mode) => set({ activeMode: mode }),
  setInputContent: (text) => set({ inputContent: text }),
  setAttachment: (attachment) => set({ attachment }),
  clearAttachment: () => set({ attachment: null }),
  resetInput: () => set({ inputContent: '', attachment: null }),
}));
