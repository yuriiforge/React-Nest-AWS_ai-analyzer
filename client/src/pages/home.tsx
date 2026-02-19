import { useState } from 'react';
import { useUploadDocument } from '@/api/hooks/useUploadDocument';
import { useDocumentStatus } from '@/api/hooks/useDocumentStatus';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, FileUp, CheckCircle, ArrowLeft } from 'lucide-react';
import { DocumentStatus } from '@/components/document-status';
import { ChatInterface } from '@/components/chat-interface';

const HomePage = () => {
  const { data: doc, isLoading: isCheckingStatus } = useDocumentStatus();

  const { mutate: upload, isPending, isSuccess, error } = useUploadDocument();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isChatActive, setIsChatActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    upload(selectedFile);
  };

  if (isCheckingStatus) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const hasDocument = doc && doc.status !== 'NO_DOCUMENT';
  const isReadyForChat = doc?.status === 'COMPLETED';

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
        <DocumentStatus onChatStart={() => setIsChatActive(true)} />
      ) : (
        // VIEW 3: Upload Card
        <Card className="border-dashed border-2 shadow-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Document Brain</CardTitle>
            <CardDescription>
              Upload a PDF to start a conversation with your data.
              <br /> Only one document can be active at a time.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer hover:bg-accent/50 transition-all border-muted-foreground/20">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FileUp className="w-12 h-12 mb-4 text-primary/60" />
                <p className="text-sm font-medium">
                  {selectedFile ? selectedFile.name : 'Click to select PDF'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PDF up to 10MB
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                accept=".pdf"
                onChange={handleFileChange}
                disabled={isPending}
              />
            </label>

            {error && (
              <p className="text-sm text-destructive font-medium bg-destructive/10 p-3 rounded-md w-full text-center">
                {error.message || 'Upload failed. Please try again.'}
              </p>
            )}

            <Button
              className="w-full py-6 text-lg"
              disabled={!selectedFile || isPending || isSuccess}
              onClick={handleUpload}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Uploading to S3...
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle className="mr-2 h-5 w-5" /> Success!
                </>
              ) : (
                'Analyze Document'
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HomePage;
