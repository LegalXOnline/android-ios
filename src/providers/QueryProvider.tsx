/**
 * React Query provider — structural stub.
 *
 * React Query (@tanstack/react-query) is NOT yet installed.
 * This file defines the provider interface so the rest of the app can import
 * from '@providers/QueryProvider' and it will be a drop-in replacement
 * when the package is installed.
 *
 * When @tanstack/react-query is installed:
 *   1. Import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
 *   2. Replace the stub implementation below with the real one.
 *
 * See 24_AI_BUILD_GUIDE.md §16 — server state via React Query.
 */
import type { ReactNode } from 'react';

interface QueryProviderProps {
  children: ReactNode;
}

/**
 * Stub: passes children through until @tanstack/react-query is installed.
 * Replace body with real QueryClientProvider when the package is available.
 */
export function QueryProvider({ children }: QueryProviderProps) {
  // TODO-STUB: Replace with real QueryClient + QueryClientProvider
  // when @tanstack/react-query is installed.
  // Config: staleTime 5min for static services, retry: 2, refetchOnWindowFocus: false
  return <>{children}</>;
}
