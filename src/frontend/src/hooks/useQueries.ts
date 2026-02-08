import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { SerializableUserProfile, ChatMessage, PublicProfile } from '../backend';
import { Principal } from '@dfinity/principal';
import { useAuth } from './useAuth';

// Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<SerializableUserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: SerializableUserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['memberDirectory'] });
    },
  });
}

export function useGetUserProfile(principal: Principal | undefined) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<SerializableUserProfile | null>({
    queryKey: ['userProfile', principal?.toString()],
    queryFn: async () => {
      if (!actor || !principal) return null;
      return actor.getUserProfile(principal);
    },
    enabled: !!actor && !actorFetching && !!principal,
    staleTime: 60000, // Cache for 1 minute
  });
}

// Chat Queries
export function useChatMessages() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ChatMessage[]>({
    queryKey: ['chatMessages'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getChatMessages();
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 3000, // Poll every 3 seconds
  });
}

export function useCreateChatMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createChatMessage(content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatMessages'] });
    },
  });
}

export function useDeleteChatMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteChatMessage(messageId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatMessages'] });
    },
  });
}

// Admin Query
export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
    staleTime: 60000, // Cache for 1 minute
  });
}

// Members Directory Query
export function useMemberDirectory() {
  const { actor, isFetching: actorFetching } = useActor();
  const { principal } = useAuth();

  return useQuery<PublicProfile[]>({
    queryKey: ['memberDirectory', principal?.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMemberDirectory();
    },
    enabled: !!actor && !actorFetching && !!principal,
    staleTime: 30000, // Cache for 30 seconds
  });
}

// Verified Badge Queries
export function useIsUserVerified(principal: Principal | undefined) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['userVerified', principal?.toString()],
    queryFn: async () => {
      if (!actor || !principal) return false;
      return actor.isUserVerified(principal);
    },
    enabled: !!actor && !actorFetching && !!principal,
    staleTime: 60000, // Cache for 1 minute
  });
}

export function useToggleVerifiedBadge() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (user: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.toggleVerifiedBadge(user);
    },
    onSuccess: () => {
      // Invalidate all relevant queries to refresh UI
      queryClient.invalidateQueries({ queryKey: ['memberDirectory'] });
      queryClient.invalidateQueries({ queryKey: ['userVerified'] });
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });
}
