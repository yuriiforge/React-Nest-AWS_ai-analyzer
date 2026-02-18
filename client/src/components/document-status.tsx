// src/components/document-status.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Trash2,
  MessageSquare,
} from 'lucide-react';
import { useDocumentStatus } from '@/api/hooks/useDocumentStatus';
import { useDeleteDocument } from '@/api/hooks/useRemoveDocument';

export const DocumentStatus = () => {
  const { data: doc, isLoading } = useDocumentStatus();

  // Custom hook we created to handle API call + query invalidation
  const { mutate: deleteDoc, isPending: isDeleting } = useDeleteDocument(
    doc?.email,
  );

  if (isLoading)
    return <Loader2 className="animate-spin mx-auto text-primary" />;
  if (!doc || doc.status === 'NO_DOCUMENT') return null;

  const isProcessing = doc.status === 'PENDING' || doc.status === 'PROCESSING';

  return (
    <Card className="w-full max-w-2xl mx-auto border-primary/20 bg-accent/5 overflow-hidden">
      {/* Progress Bar for visual feedback */}
      {isProcessing && (
        <div className="h-1 w-full bg-yellow-500 animate-pulse" />
      )}

      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl">Active Document</CardTitle>
          <p className="text-sm text-muted-foreground truncate max-w-[300px]">
            {doc.fileName}
          </p>
        </div>
        {isProcessing ? (
          <Clock className="text-yellow-500 animate-spin-slow h-6 w-6" />
        ) : doc.status === 'COMPLETED' ? (
          <CheckCircle2 className="text-green-500 h-6 w-6" />
        ) : (
          <AlertCircle className="text-red-500 h-6 w-6" />
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-background rounded-lg border">
          <span className="text-sm font-medium">Pipeline Status</span>
          <span
            className={`text-sm font-bold uppercase ${isProcessing ? 'text-yellow-600' : 'text-primary'}`}
          >
            {doc.status}
          </span>
        </div>

        {doc.status === 'COMPLETED' && (
          <Button
            className="w-full gap-2"
            onClick={() => {
              /* navigate('/chat') */
            }}
          >
            <MessageSquare className="h-4 w-4" /> Start Chatting
          </Button>
        )}

        <Button
          variant="ghost"
          className="w-full text-destructive hover:bg-destructive/10"
          size="sm"
          disabled={isDeleting}
          onClick={() => deleteDoc()}
        >
          {isDeleting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="mr-2 h-4 w-4" />
          )}
          Remove and Start Over
        </Button>
      </CardContent>
    </Card>
  );
};
