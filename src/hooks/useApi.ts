'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, Creator, TipRequest, SettleRequest, CreateCreatorRequest, CreatorWithSessions } from '@/lib/api';

// Query to fetch creator by handle
export function useCreator(handle: string | null) {
  return useQuery({
    queryKey: ['creator', handle],
    queryFn: () => api.getCreator(handle!),
    enabled: !!handle,
  });
}

// Query to fetch creator by address
export function useCreatorByAddress(address: string | undefined) {
  return useQuery({
    queryKey: ['creator', 'address', address],
    queryFn: () => api.getCreatorByAddress(address!),
    enabled: !!address,
    retry: false, // Don't retry if creator doesn't exist
  });
}

// Query to fetch creator with sessions
export function useCreatorWithSessions(address: string | undefined) {
  return useQuery({
    queryKey: ['creator', 'sessions', address],
    queryFn: () => api.getCreatorWithSessions(address!),
    enabled: !!address,
    retry: false,
  });
}

// Mutation to create creator
export function useCreateCreator() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateCreatorRequest) => api.createCreator(data),
    onSuccess: (data) => {
      // Invalidate all creator-related queries to refresh dashboard
      queryClient.invalidateQueries({ queryKey: ['creator', 'address', data.address] });
      queryClient.invalidateQueries({ queryKey: ['creator', 'sessions', data.address] });
      queryClient.invalidateQueries({ queryKey: ['creator', data.handle] });
    },
  });
}

// Mutation to send tip (off-chain Yellow logic)
export function useSendTip() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (tipData: TipRequest) => api.sendTip(tipData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'] });
    },
  });
}

// Mutation to settle session (on-chain settlement)
export function useSettleSession() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (settleData: SettleRequest) => api.settleSession(settleData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'] });
      queryClient.invalidateQueries({ queryKey: ['balance'] });
      queryClient.invalidateQueries({ queryKey: ['creator', 'sessions'] });
    },
  });
}
