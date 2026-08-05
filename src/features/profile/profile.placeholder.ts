export interface UserProfilePayload {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  gender: string;
  lxCoinsBalance: number;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
}

export type OrderStatus = 'Completed' | 'Pending' | 'Cancelled' | 'Refunded';
export type OrderType = 'Documentation' | 'Verification' | 'Lawyer Consultation' | 'LX Coins';

export interface OrderPayload {
  id: string;
  orderType: OrderType;
  serviceTitle: string;
  planName?: string;
  date: string;
  amount: number;
  status: OrderStatus;
  lawyerName?: string;
  uploadedFileName?: string;
  paymentMethod?: string;
  taxAmount?: number;
  subtotal?: number;
}

export type ConsultationStatus = 'Completed' | 'Upcoming' | 'Cancelled';
export type ConsultationMode = 'Chat' | 'Voice' | 'Video';

export interface ConsultationHistoryPayload {
  id: string;
  lawyerId: string;
  lawyerName: string;
  lawyerTitle: string;
  mode: ConsultationMode;
  date: string;
  duration: string;
  amount: number;
  status: ConsultationStatus;
  notes?: string;
}

export type NotificationCategory =
  | 'Order Update'
  | 'Consultation'
  | 'Document Ready'
  | 'Payment'
  | 'LX Coins'
  | 'Promotions'
  | 'Support';

export interface NotificationPayload {
  id: string;
  title: string;
  message: string;
  time: string;
  category: NotificationCategory;
  isRead: boolean;
}

export type TicketCategory =
  | 'Payments'
  | 'Documents'
  | 'Verification'
  | 'Consultation'
  | 'Account'
  | 'Other';

export type TicketStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';

export interface SupportTicketPayload {
  id: string;
  category: TicketCategory;
  subject: string;
  description: string;
  date: string;
  status: TicketStatus;
  messages: { sender: 'User' | 'Support'; text: string; time: string }[];
}

export const PLACEHOLDER_USER_PROFILE: UserProfilePayload = {
  name: 'Prince Kumar',
  email: 'prince.kumar@example.com',
  phone: '+91 98765 43210',
  address: '42, Cyber City, Sector 24',
  city: 'Gurugram',
  state: 'Haryana',
  pincode: '122002',
  gender: 'Male',
  lxCoinsBalance: 250,
  isPhoneVerified: true,
  isEmailVerified: true,
};

export const PLACEHOLDER_ORDERS: OrderPayload[] = [
  {
    id: 'LX-ORD-8492',
    orderType: 'Documentation',
    serviceTitle: 'GST Registration Audit',
    planName: 'Standard Registration Package',
    date: '04 Aug 2026',
    amount: 1499,
    status: 'Completed',
    paymentMethod: 'UPI (Google Pay)',
    subtotal: 1270,
    taxAmount: 229,
  },
  {
    id: 'LX-ORD-8493',
    orderType: 'Verification',
    serviceTitle: 'Rent Agreement Verification',
    planName: 'Review + Advocate Consultation',
    uploadedFileName: 'Rental_Agreement_2026.pdf',
    lawyerName: 'Adv. Rajesh Mehta',
    date: '02 Aug 2026',
    amount: 299,
    status: 'Pending',
    paymentMethod: 'Credit Card',
    subtotal: 253,
    taxAmount: 46,
  },
  {
    id: 'LX-ORD-8494',
    orderType: 'Lawyer Consultation',
    serviceTitle: '1-on-1 Legal Strategy Session',
    lawyerName: 'Adv. Priya Sharma',
    date: '28 Jul 2026',
    amount: 300,
    status: 'Completed',
    paymentMethod: 'LX Coins Wallet',
    subtotal: 300,
    taxAmount: 0,
  },
  {
    id: 'LX-ORD-8495',
    orderType: 'LX Coins',
    serviceTitle: 'Purchase 250 LX Coins',
    date: '20 Jul 2026',
    amount: 250,
    status: 'Completed',
    paymentMethod: 'UPI (PhonePe)',
    subtotal: 212,
    taxAmount: 38,
  },
];

export const PLACEHOLDER_CONSULTATIONS: ConsultationHistoryPayload[] = [
  {
    id: 'cons-201',
    lawyerId: 'lawyer-1',
    lawyerName: 'Adv. Priya Sharma',
    lawyerTitle: 'Corporate & Tax Specialist',
    mode: 'Video',
    date: 'Tomorrow, 02:00 PM',
    duration: '15 Mins',
    amount: 300,
    status: 'Upcoming',
    notes: 'Review startup founder agreement and ESOP structure.',
  },
  {
    id: 'cons-202',
    lawyerId: 'lawyer-2',
    lawyerName: 'Adv. Rajesh Mehta',
    lawyerTitle: 'Property & Real Estate Law',
    mode: 'Voice',
    date: '03 Aug 2026',
    duration: '15 Mins',
    amount: 270,
    status: 'Completed',
    notes: 'Checked commercial property lease deed clause 14.',
  },
  {
    id: 'cons-203',
    lawyerId: 'lawyer-3',
    lawyerName: 'Adv. Ananya Roy',
    lawyerTitle: 'Family Law & Civil Disputes',
    mode: 'Chat',
    date: '15 Jul 2026',
    duration: '15 Mins',
    amount: 200,
    status: 'Completed',
  },
];

export const PLACEHOLDER_NOTIFICATIONS: NotificationPayload[] = [
  {
    id: 'notif-1',
    title: 'Consultation Confirmed',
    message: 'Your 1-on-1 video session with Adv. Priya Sharma is scheduled for Tomorrow at 02:00 PM.',
    time: '15m ago',
    category: 'Consultation',
    isRead: false,
  },
  {
    id: 'notif-2',
    title: 'Document Verification Complete',
    message: 'Your Rental Agreement Verification report is now ready for download in My Orders.',
    time: '2h ago',
    category: 'Document Ready',
    isRead: false,
  },
  {
    id: 'notif-3',
    title: 'Payment Successful',
    message: 'Payment of ₹299 for Order #LX-ORD-8493 was successfully processed.',
    time: '1d ago',
    category: 'Payment',
    isRead: true,
  },
  {
    id: 'notif-4',
    title: 'Bonus LX Coins Added',
    message: '250 LX Coins have been added to your LegalX Wallet balance.',
    time: '3d ago',
    category: 'LX Coins',
    isRead: true,
  },
];

export const PLACEHOLDER_TICKETS: SupportTicketPayload[] = [
  {
    id: 'TICK-9012',
    category: 'Verification',
    subject: 'Delay in Document Verification Report',
    description: 'My rental agreement document was uploaded 2 days ago but status is still pending.',
    date: '04 Aug 2026',
    status: 'In Progress',
    messages: [
      {
        sender: 'User',
        text: 'My rental agreement document was uploaded 2 days ago but status is still pending.',
        time: '04 Aug 10:30 AM',
      },
      {
        sender: 'Support',
        text: 'Hello Prince, our advocate team is reviewing clause 12. Your report will be published within 2 hours.',
        time: '04 Aug 02:15 PM',
      },
    ],
  },
  {
    id: 'TICK-9013',
    category: 'Payments',
    subject: 'Double charge on GST service order',
    description: 'Amount ₹1499 was debited twice during UPI payment.',
    date: '25 Jul 2026',
    status: 'Resolved',
    messages: [
      {
        sender: 'User',
        text: 'Amount ₹1499 was debited twice during UPI payment.',
        time: '25 Jul 11:00 AM',
      },
      {
        sender: 'Support',
        text: 'Refund of ₹1499 has been initiated to your source bank account via Razorpay.',
        time: '25 Jul 04:00 PM',
      },
    ],
  },
];
