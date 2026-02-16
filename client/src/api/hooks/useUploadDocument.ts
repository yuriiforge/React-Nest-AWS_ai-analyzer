import { useMutation } from '@tanstack/react-query';
import { api } from '@/api/client';
import axios from 'axios';
import { STORAGE_KEYS } from '@/constants/storage_keys';

export const useUploadDocument = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      const userRaw = localStorage.getItem(STORAGE_KEYS.USER);
      if (!userRaw) throw new Error('User not authenticated');
      const { email } = JSON.parse(userRaw);

      const {
        data: { uploadUrl, s3Key },
      } = await api.post('/uploads/presigned-url', {
        email,
        fileName: file.name,
        fileSize: file.size,
      });

      await axios.put(uploadUrl, file, {
        headers: { 'Content-Type': 'application/pdf' },
      });

      const { data: document } = await api.post('/documents', {
        email,
        fileName: file.name,
        s3Key,
      });

      return document;
    },
  });
};
