import { useRouter, type Href } from 'expo-router';
import { useCallback } from 'react';

/**
 * Back, with somewhere to land.
 *
 * router.back() throws "GO_BACK was not handled by any navigator" whenever
 * there is no history — a deep link, a reload straight onto the screen, or the
 * first screen after a redirect. The fallback is where the screen belongs.
 */
export function useGoBack(fallback: Href = '/(tabs)'): () => void {
  const router = useRouter();

  return useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace(fallback);
  }, [router, fallback]);
}
