/**
 * Booking store — structural stub.
 *
 * Zustand is NOT yet installed.
 * Stores the in-progress consultation booking payload across the
 * Mode Selection → Date → Time → Billing flow.
 *
 * Global state scope: in-progress order/booking payload only.
 * and the in-progress order/booking payload."
 *
 * When zustand is installed:
 *   export const useBookingStore = create<BookingState>(...)
 */
import { createContext, useContext, useState, type ReactNode } from 'react';

import type { ConsultationMode } from '@/types/database.types';

// ─── State shape ──────────────────────────────────────────────────────────────

export interface BookingPayload {
  lawyer_id: string;
  lawyer_name: string;
  mode: ConsultationMode | null;
  /** ISO date string 'YYYY-MM-DD' */
  selected_date: string | null;
  /** e.g. '10:00' */
  selected_time_slot: string | null;
  is_instant: boolean;
  /** Per-minute rate for the selected mode (INR) */
  fee_per_minute: number | null;
}

export interface BookingState {
  payload: BookingPayload | null;
  setPayload: (payload: BookingPayload) => void;
  clearBooking: () => void;
}

// ─── Stub implementation via React Context ────────────────────────────────────

const BookingStoreContext = createContext<BookingState | null>(null);

export function BookingStoreProvider({ children }: { children: ReactNode }) {
  const [payload, setPayloadState] = useState<BookingPayload | null>(null);

  const value: BookingState = {
    payload,
    setPayload: (p) => setPayloadState(p),
    clearBooking: () => setPayloadState(null),
  };

  return <BookingStoreContext.Provider value={value}>{children}</BookingStoreContext.Provider>;
}

export function useBookingStore(): BookingState {
  const store = useContext(BookingStoreContext);
  if (!store) {
    throw new Error('useBookingStore must be used within BookingStoreProvider');
  }
  return store;
}
