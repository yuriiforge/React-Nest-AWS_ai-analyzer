import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/client';
import axios from 'axios';
import { useUser } from '@/lib/context/user-context';

const sanitizeFileName = (name: string) => {
  return name
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9.-]/g, '')
    .toLowerCase();
};

export const useUploadDocument = () => {
  const { user } = useUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const cleanName = sanitizeFileName(file.name);

      const {
        data: { uploadUrl, s3Key },
      } = await api.post('/uploads/presigned-url', {
        email: user?.email,
        fileName: cleanName,
        fileSize: file.size,
      });

      await axios.put(uploadUrl, file, {
        headers: { 'Content-Type': 'application/pdf' },
      });

      const { data: document } = await api.post('/documents', {
        email: user?.email,
        fileName: cleanName,
        s3Key,
      });

      return document;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document-status'] });
    },
  });
};
