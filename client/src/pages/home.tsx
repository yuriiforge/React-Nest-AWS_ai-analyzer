import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';
import { DocumentStatus } from '@/components/document-status';
import { ChatInterface } from '@/components/chat-interface';
import { useHomePage } from '@/api/hooks/useHomePage';
import { UploadCard } from '@/components/upload-card';

const HomePage = () => {
  const {
    isCheckingStatus,
    hasDocument,
    isChatActive,
    isReadyForChat,
    selectedFile,
    isUploading,
    isSuccess,
    error,
    setIsChatActive,
    handleFileChange,
    handleUpload,
    doc,
    isDeleting,
    handleDelete,
  } = useHomePage();

  if (isCheckingStatus) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isChatActive && isReadyForChat) {
    return (
      <div className="container max-w-4xl py-10 mx-auto space-y-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsChatActive(false)}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Status
        </Button>
        <ChatInterface />
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-10 mx-auto space-y-8">
      {hasDocument ? (
        <DocumentStatus
          doc={doc}
          isDeleting={isDeleting}
          onDelete={handleDelete}
          onChatStart={() => setIsChatActive(true)}
        />
      ) : (
        <UploadCard
          selectedFile={selectedFile}
          isPending={isUploading}
          isSuccess={isSuccess}
          error={error}
          onFileChange={handleFileChange}
          onUpload={handleUpload}
        />
      )}
    </div>
  );
};

export default HomePage;
