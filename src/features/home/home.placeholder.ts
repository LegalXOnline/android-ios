import type { LawyerCardData } from '@shared/components';
import { PLACEHOLDER_LAWYERS_FULL } from '../lawyer/lawyer.placeholder';

export interface HomePlaceholderService {
  id: string;
  title: string;
  description: string;
  priceLine: string;
}

export const PLACEHOLDER_POPULAR_SERVICES: HomePlaceholderService[] = [
  {
    id: 'gst-registration',
    title: 'GST Registration',
    description: 'Complete GST registration with government filing support.',
    priceLine: 'From ₹499',
  },
  {
    id: 'trademark-registration',
    title: 'Trademark Registration',
    description: 'Protect your brand identity with official trademark filing.',
    priceLine: 'From ₹1,499',
  },
  {
    id: 'legal-notice',
    title: 'Legal Notice',
    description: 'Professionally drafted legal notices for any dispute.',
    priceLine: 'From ₹799',
  },
  {
    id: 'rent-agreement',
    title: 'Rent Agreement',
    description: 'Legally binding rental agreements drafted by experts.',
    priceLine: 'From ₹399',
  },
];

export const PLACEHOLDER_LAWYERS: LawyerCardData[] = PLACEHOLDER_LAWYERS_FULL.slice(0, 3);
