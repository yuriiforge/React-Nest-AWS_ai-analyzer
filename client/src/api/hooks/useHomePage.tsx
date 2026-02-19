import { useState } from 'react';
import { useUploadDocument } from '@/api/hooks/useUploadDocument';
import { useDocumentStatus } from '@/api/hooks/useDocumentStatus';
import { useDeleteDocument } from '@/api/hooks/useRemoveDocument';
import { DocumentStatusType } from '@/constants/document_status';

export const useHomePage = () => {
  const { data: doc, isLoading: isCheckingStatus } = useDocumentStatus();
  const {
    mutate: upload,
    isPending: isUploading,
    isSuccess,
    error: uploadError,
  } = useUploadDocument();

  const { mutate: deleteDoc, isPending: isDeleting } = useDeleteDocument(
    doc?.email,
  );

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isChatActive, setIsChatActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setSelectedFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedFile) upload(selectedFile);
  };

  const handleDelete = () => {
    if (
      window.confirm(
        'Are you sure you want to delete this document? This cannot be undone.',
      )
    ) {
      deleteDoc();
    }
  };

  const hasDocument = !!doc && doc.status !== DocumentStatusType.NO_DOCUMENT;
  const isReadyForChat = doc?.status === DocumentStatusType.COMPLETED;

  return {
    doc,
    isCheckingStatus,
    isUploading,
    isDeleting,
    isSuccess,
    error: uploadError,
    selectedFile,
    isChatActive,
    setIsChatActive,
    handleFileChange,
    handleUpload,
    handleDelete,
    hasDocument,
    isReadyForChat,
  };
};
