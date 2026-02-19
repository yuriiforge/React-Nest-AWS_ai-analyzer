import { DocumentStatusType } from '@/constants/document_status';
import type { DocumentStatus } from '@/types/document';

interface StatusBadgeProps {
  status: DocumentStatus;
  isProcessing: boolean;
}

export const StatusBadge = ({ status, isProcessing }: StatusBadgeProps) => {
  const statusStyles: Record<DocumentStatus, string> = {
    [DocumentStatusType.PENDING]:
      'text-yellow-600 bg-yellow-50 border-yellow-200',
    [DocumentStatusType.PROCESSING]:
      'text-yellow-600 bg-yellow-50 border-yellow-200',
    [DocumentStatusType.COMPLETED]:
      'text-primary bg-primary/10 border-primary/20',
    [DocumentStatusType.FAILED]:
      'text-destructive bg-destructive/10 border-destructive/20',
    [DocumentStatusType.NO_DOCUMENT]:
      'text-muted-foreground bg-muted border-transparent',
  };

  return (
    <div className="flex items-center justify-between p-4 bg-background rounded-lg border">
      <span className="text-sm font-medium">Pipeline Status</span>
      <span
        className={`text-xs font-bold uppercase px-2.5 py-0.5 rounded-full border ${
          statusStyles[status]
        } ${isProcessing ? 'animate-pulse' : ''}`}
      >
        {isProcessing ? 'Processing...' : status.replace('_', ' ')}
      </span>
    </div>
  );
};
