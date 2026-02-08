import { useMemo } from 'react';
import { useGetUserProfile, useIsUserVerified } from '../../hooks/useQueries';
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

export function useAuthorInfo(author: Principal) {
  const { data: profile } = useGetUserProfile(author);
  const { data: isVerified } = useIsUserVerified(author);
  
  return useMemo(() => {
    const displayName = profile?.displayName || 'Anonymous User';
    return {
      displayName,
      isVerified: isVerified || false,
    };
  }, [profile, isVerified]);
}
