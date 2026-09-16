/**
 * Lawyer Profile Route — SCR-09
 *
 * Spec: 09_Module_Talk_to_Lawyer.md
 */
import { useLocalSearchParams } from 'expo-router';

import { LawyerProfileScreen } from '@features/lawyer/LawyerProfileScreen';

export default function LawyerProfileRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <LawyerProfileScreen lawyerId={id ?? ''} />;
}
