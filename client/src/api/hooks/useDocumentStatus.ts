import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/client';
import { useUser } from '@/lib/context/user-context';
import { DocumentStatusType } from '@/constants/document_status';

export const useDocumentStatus = () => {
  const { user } = useUser();
  const email = user?.email;

  return useQuery({
    queryKey: ['document-status', email],
    queryFn: async () => {
      const { data } = await api.get(`/documents/status?email=${email}`);
      return data;
    },
    enabled: !!email,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === DocumentStatusType.PENDING ||
        status === DocumentStatusType.PROCESSING
        ? 3000
        : false;
    },
  });
};
