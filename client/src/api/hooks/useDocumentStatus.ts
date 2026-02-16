import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/client';
import { STORAGE_KEYS } from '@/constants/storage_keys';

export const useDocumentStatus = () => {
  const userRaw = localStorage.getItem(STORAGE_KEYS.USER);
  const email = userRaw ? JSON.parse(userRaw).email : null;

  return useQuery({
    queryKey: ['document-status', email],
    queryFn: async () => {
      const { data } = await api.get(`/documents/status?email=${email}`);
      return data;
    },
    enabled: !!email,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === 'PENDING' || status === 'PROCESSING' ? 3000 : false;
    },
  });
};
