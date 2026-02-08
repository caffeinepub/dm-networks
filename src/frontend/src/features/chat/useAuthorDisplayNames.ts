import { useMemo } from 'react';
import { useGetUserProfile } from '../../hooks/useQueries';
import type { Principal } from '@dfinity/principal';

export function useAuthorDisplayName(author: Principal) {
  const { data: profile } = useGetUserProfile(author);
  
  return useMemo(() => {
    if (profile?.displayName) {
      return profile.displayName;
    }
    return 'Anonymous User';
  }, [profile]);
}

