/**
 * Insightify — useReport (Reports Feature Hook)
 *
 * Manages all local state for the Report form:
 * - Selected reason
 * - Additional details (with 300 char limit)
 * - Evidence images (local)
 * - Submission state (idle / loading / success / error)
 *
 * AGENTS.md & docs/RULES.md
 */

import { useState, useCallback } from 'react';
import { submitReport } from '../services/reportApi';

export const MAX_DETAILS_CHARS = 300;

export function useReport() {
  const [selectedReason, setSelectedReason] = useState(null);
  const [details, setDetails] = useState('');
  const [evidence, setEvidence] = useState([]); // array of { uri, name, type }
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSelectReason = useCallback((reasonId) => {
    setSelectedReason(reasonId);
    setSubmitError(null);
  }, []);

  const handleDetailsChange = useCallback((text) => {
    if (text.length <= MAX_DETAILS_CHARS) {
      setDetails(text);
    }
  }, []);

  const handleAddEvidence = useCallback((images) => {
    setEvidence((prev) => [...prev, ...images].slice(0, 3)); // max 3 images
  }, []);

  const handleRemoveEvidence = useCallback((uri) => {
    setEvidence((prev) => prev.filter((e) => e.uri !== uri));
  }, []);

  const handleSubmit = useCallback(async (threatContext = {}) => {
    if (!selectedReason) {
      setSubmitError('Please select a reason for reporting.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await submitReport({
        reasonId: selectedReason,
        details: details.trim(),
        evidence,
        threatContext,
      });
      setIsSuccess(true);
    } catch (err) {
      setSubmitError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedReason, details, evidence]);

  const handleReset = useCallback(() => {
    setSelectedReason(null);
    setDetails('');
    setEvidence([]);
    setIsSubmitting(false);
    setSubmitError(null);
    setIsSuccess(false);
  }, []);

  return {
    selectedReason,
    details,
    evidence,
    isSubmitting,
    submitError,
    isSuccess,
    handleSelectReason,
    handleDetailsChange,
    handleAddEvidence,
    handleRemoveEvidence,
    handleSubmit,
    handleReset,
  };
}
