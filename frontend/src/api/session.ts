import axios from 'axios';
import { useMutation, useQuery } from '@tanstack/vue-query';
import type { MaybeRef } from 'vue';
import { io } from 'socket.io-client';
import { deboxMaybeRef } from '@/util/debox';

const client = axios.create({
  baseURL: `${import.meta.env.VITE_API_ENDPOINT}/session`,
});

export const socket = io(import.meta.env.VITE_SOCKET_ENDPOINT, {
  autoConnect: false,
  closeOnBeforeunload: true,
});

export interface Session {
  owner: string;
  users: string[];
  state: 'wait' | 'swipe' | 'match';
  match?: string;
}

async function postSession(user: string): Promise<string> {
  const result = await client.post('/', { user });
  return result.data;
}

async function getSession(code: string) {
  const result = await client.get<Session>(code);
  return result.data;
}

export function usePostSession() {
  return useMutation<string, never, string>({
    mutationFn: async (user) => await postSession(user),
  });
}

export function useSessionInfo(code: MaybeRef<string>) {
  return useQuery({
    queryKey: ['session', code],
    queryFn: async () => await getSession(deboxMaybeRef(code)),
    staleTime: 0,
  });
}
