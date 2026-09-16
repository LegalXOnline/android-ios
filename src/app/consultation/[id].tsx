import { useLocalSearchParams } from 'expo-router';

import { ConsultationRoomScreen } from '@features/consultation/ConsultationRoomScreen';

export default function ConsultationRoute() {
  const { id, name, fee, type } = useLocalSearchParams<{
    id: string;
    name?: string;
    fee?: string;
    type?: string;
  }>();

  return (
    <ConsultationRoomScreen
      consultationId={id ?? ''}
      counterpartName={name}
      feePerMinute={fee ? Number(fee) : null}
      initialType={type === 'voice' || type === 'video' ? type : 'chat'}
    />
  );
}
