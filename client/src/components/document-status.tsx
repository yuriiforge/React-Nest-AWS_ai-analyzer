import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
  MessageSquare,
  Trash2,
} from 'lucide-react';
import { DocumentStatusType } from '@/constants/document_status';
import type { Document } from '@/types/document';
import { StatusBadge } from './status-badge';

interface DocumentStatusProps {
  doc: Document;
  isDeleting: boolean;
  onDelete: () => void;
  onChatStart: () => void;
}

export const DocumentStatus = ({
  doc,
  isDeleting,
  onDelete,
  onChatStart,
}: DocumentStatusProps) => {
  const isProcessing =
    doc.status === DocumentStatusType.PENDING ||
    doc.status === DocumentStatusType.PROCESSING;
  const isCompleted = doc.status === DocumentStatusType.COMPLETED;

  return (
    <Card className="w-full max-w-2xl mx-auto border-primary/20 bg-accent/5 overflow-hidden">
      {isProcessing && (
        <div className="h-1 w-full bg-yellow-500 animate-pulse" />
      )}

      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="text-xl">Active Document</CardTitle>
          <p
            className="text-sm text-muted-foreground truncate max-w-75"
            title={doc.fileName}
          >
            {doc.fileName}
          </p>
        </div>
        <StatusIcon status={doc.status} isProcessing={isProcessing} />
      </CardHeader>

      <CardContent className="space-y-4">
        <StatusBadge status={doc.status} isProcessing={isProcessing} />

        {isCompleted && (
          <Button className="w-full gap-2" onClick={onChatStart}>
            <MessageSquare className="h-4 w-4" /> Start Chatting
          </Button>
        )}

        <Button
          variant="ghost"
          className="w-full text-destructive hover:bg-destructive/10"
          size="sm"
          disabled={isDeleting || isProcessing}
          onClick={onDelete}
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

const StatusIcon = ({
  status,
  isProcessing,
}: {
  status: string;
  isProcessing: boolean;
}) => {
  if (isProcessing)
    return <Clock className="text-yellow-500 animate-spin-slow h-6 w-6" />;
  if (status === 'COMPLETED')
    return <CheckCircle2 className="text-green-500 h-6 w-6" />;
  return <AlertCircle className="text-red-500 h-6 w-6" />;
};
