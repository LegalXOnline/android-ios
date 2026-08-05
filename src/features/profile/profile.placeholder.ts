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

export interface OrderPayload {
  id: string;
  serviceTitle: string;
  date: string;
  amount: number;
  status: 'Completed' | 'Processing' | 'Refunded';
}

export interface ConsultationHistoryPayload {
  id: string;
  lawyerName: string;
  lawyerTitle: string;
  mode: 'Chat' | 'Voice' | 'Video';
  date: string;
  duration: string;
  amount: number;
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
    id: 'ord-101',
    serviceTitle: 'GST Registration Audit',
    date: 'Aug 01, 2026',
    amount: 1499,
    status: 'Completed',
  },
  {
    id: 'ord-102',
    serviceTitle: 'Rent Agreement Review (₹99 Verification)',
    date: 'Jul 26, 2026',
    amount: 99,
    status: 'Completed',
  },
  {
    id: 'ord-103',
    serviceTitle: 'Trademark Filing Consultation',
    date: 'Jul 14, 2026',
    amount: 499,
    status: 'Completed',
  },
];

export const PLACEHOLDER_CONSULTATIONS: ConsultationHistoryPayload[] = [
  {
    id: 'cons-201',
    lawyerName: 'Adv. Priya Sharma',
    lawyerTitle: 'Corporate & Tax Specialist',
    mode: 'Video',
    date: 'Aug 03, 2026',
    duration: '15 Mins',
    amount: 300,
  },
  {
    id: 'cons-202',
    lawyerName: 'Adv. Rajesh Mehta',
    lawyerTitle: 'Property & Real Estate Law',
    mode: 'Voice',
    date: 'Jul 21, 2026',
    duration: '15 Mins',
    amount: 270,
  },
];
