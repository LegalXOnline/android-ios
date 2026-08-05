/**
 * Format utilities — India locale.
 *
 * Pure functions, no side effects, no RN imports.
 * Used across Billing, Lawyer Profile, Transactions, LX Coins screens.
 *
 * Currency: INR only (01_Product_Vision.md — India-only, 16_Payments §7).
 * Locale: en-IN for Indian number formatting (₹1,00,000 style).
 */

// ─── Currency ─────────────────────────────────────────────────────────────────

const INR_FORMATTER = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/**
 * Format a numeric amount as INR currency.
 * @example formatCurrency(1500) → "₹1,500"
 */
export function formatCurrency(amount: number): string {
  return INR_FORMATTER.format(amount);
}

/**
 * Format a per-minute fee for lawyer consultation display.
 * @example formatPerMinute(10) → "₹10/min"
 */
export function formatPerMinute(feePerMinute: number): string {
  return `${formatCurrency(feePerMinute)}/min`;
}

// ─── Duration ─────────────────────────────────────────────────────────────────

/**
 * Format duration in minutes to a human-readable string.
 * @example formatDuration(90) → "1h 30m"
 * @example formatDuration(45) → "45m"
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

// ─── Dates ────────────────────────────────────────────────────────────────────

const DATE_FORMATTER = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'Asia/Kolkata',
});

const TIME_FORMATTER = new Intl.DateTimeFormat('en-IN', {
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
  timeZone: 'Asia/Kolkata',
});

/**
 * Format an ISO date string for display (India timezone).
 * @example formatDate("2026-09-01T10:00:00Z") → "1 Sep 2026"
 */
export function formatDate(isoString: string): string {
  return DATE_FORMATTER.format(new Date(isoString));
}

/**
 * Format an ISO date string as a short date for booking display.
 * @example formatShortDate("2026-09-01") → "Mon, 1 Sep"
 */
export function formatShortDate(isoDateString: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: 'Asia/Kolkata',
  }).format(new Date(isoDateString));
}

/**
 * Format an ISO date string as time (India timezone).
 * @example formatTime("2026-09-01T10:30:00Z") → "4:00 PM"
 */
export function formatTime(isoString: string): string {
  return TIME_FORMATTER.format(new Date(isoString));
}

/**
 * Format a time slot string for display.
 * @example formatTimeSlot("10:00") → "10:00 AM"
 */
export function formatTimeSlot(timeSlot: string): string {
  const [hours, minutes] = timeSlot.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

/**
 * Get the next N days from today as ISO date strings.
 * Used by Date Selection screen (SCR-11) — 5-day window per spec.
 * See 10_Module_Consultation_Booking §3.1, 13_Data_Model §2.5.
 */
export function getNextNDays(n: number): string[] {
  const days: string[] = [];
  const today = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
}

// ─── LX Coins ─────────────────────────────────────────────────────────────────

/**
 * Format LX Coin balance for display.
 * @example formatLxCoins(1250) → "1,250 LX Coins"
 */
export function formatLxCoins(balance: number): string {
  return `${new Intl.NumberFormat('en-IN').format(balance)} LX Coins`;
}
