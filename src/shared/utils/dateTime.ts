export interface DateSlot {
  label: string;
  val: string;
}

export function getNextFiveDays(): DateSlot[] {
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const slots: DateSlot[] = [];
  const today = new Date();

  for (let i = 0; i < 5; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dayName = DAYS[d.getDay()];
    const dateNum = d.getDate();
    const monthName = MONTHS[d.getMonth()];
    const dateStr = `${dateNum} ${monthName}`;
    const label = i === 0 ? `Today (${dateStr})` : `${dayName}, ${dateStr}`;
    slots.push({ label, val: dateStr });
  }

  return slots;
}

export const DEFAULT_TIME_SLOTS = [
  '09:00 AM',
  '10:30 AM',
  '12:00 PM',
  '02:00 PM',
  '04:00 PM',
  '06:00 PM',
];
