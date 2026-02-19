import { useMutation } from '@tanstack/react-query';
import { api } from '@/api/client';
import axios from 'axios';
import { useUser } from '@/lib/context/user-context';

export const useUploadDocument = () => {
  const { user } = useUser();

  return useMutation({
    mutationFn: async (file: File) => {
      const {
        data: { uploadUrl, s3Key },
      } = await api.post('/uploads/presigned-url', {
        email: user?.email,
        fileName: file.name,
        fileSize: file.size,
      });

      await axios.put(uploadUrl, file, {
        headers: { 'Content-Type': 'application/pdf' },
      });

      const { data: document } = await api.post('/documents', {
        email: user?.email,
        fileName: file.name,
        s3Key,
      });

      return document;
    },
  });
};
