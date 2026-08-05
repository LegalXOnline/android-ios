/**
 * Verification module state management.
 *
 * Tracks plan selection, document details, and consultation options.
 * No external dependencies — pure React state listener pattern.
 */
import { useEffect, useState } from 'react';

export type VerificationPlanId = 'review_only' | 'review_consultation';

export interface VerificationState {
  selectedPlan: VerificationPlanId;
  documentType: string;
  language: string;
  consultationType: 'Chat' | 'Voice' | 'Video';
  consultationDate: string;
  consultationTime: string;
  consultationLanguage: string;
}

export const VERIFICATION_PLANS = {
  REVIEW_ONLY: {
    id: 'review_only' as VerificationPlanId,
    title: 'AI + Expert Review',
    priceLine: '₹99',
    priceNumeric: 99,
    includes: [
      'AI Review',
      'Risk Detection',
      'Clause Review',
      'Suggestions',
    ],
  },
  REVIEW_CONSULTATION: {
    id: 'review_consultation' as VerificationPlanId,
    title: 'Expert Review + Consultation',
    priceLine: '₹499',
    priceNumeric: 499,
    includes: [
      'Human Expert Review',
      'Legal Suggestions',
      'Chat / Voice / Video Consultation',
    ],
  },
} as const;

const defaultState: VerificationState = {
  selectedPlan: 'review_only',
  documentType: 'Property Agreement',
  language: 'English',
  consultationType: 'Chat',
  consultationDate: 'Tomorrow',
  consultationTime: '10:00 AM',
  consultationLanguage: 'English',
};

let currentState: VerificationState = { ...defaultState };
const listeners = new Set<() => void>();

export const verificationStore = {
  get: () => currentState,
  set: (partial: Partial<VerificationState>) => {
    currentState = { ...currentState, ...partial };
    listeners.forEach((l) => l());
  },
  reset: () => {
    currentState = { ...defaultState };
    listeners.forEach((l) => l());
  },
};

export function useVerificationStore(): [VerificationState, typeof verificationStore.set] {
  const [state, setState] = useState<VerificationState>(currentState);

  useEffect(() => {
    const listener = () => setState({ ...currentState });
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return [state, verificationStore.set];
}
