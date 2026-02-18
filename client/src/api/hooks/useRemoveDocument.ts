import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/client';

export const useDeleteDocument = (email: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await api.delete(`/documents?email=${email}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document-status', email] });
    },
  });
};
