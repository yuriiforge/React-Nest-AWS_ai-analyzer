import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Trash2,
} from 'lucide-react';
import { useDocumentStatus } from '@/api/hooks/useDocumentStatus';

export const DocumentStatus = () => {
  const { data: doc, isLoading } = useDocumentStatus();

  if (isLoading) return <Loader2 className="animate-spin mx-auto" />;
  if (!doc || doc.status === 'NO_DOCUMENT') return null;

  const isProcessing = doc.status === 'PENDING' || doc.status === 'PROCESSING';

  return (
    <Card className="w-full max-w-2xl mx-auto border-primary/20 bg-accent/5">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl">Active Document</CardTitle>
          <p className="text-sm text-muted-foreground">{doc.fileName}</p>
        </div>
        {isProcessing ? (
          <Clock className="text-yellow-500 animate-pulse h-6 w-6" />
        ) : doc.status === 'COMPLETED' ? (
          <CheckCircle2 className="text-green-500 h-6 w-6" />
        ) : (
          <AlertCircle className="text-red-500 h-6 w-6" />
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-background rounded-lg border">
          <span className="text-sm font-medium">Status</span>
          <span
            className={`text-sm font-bold ${isProcessing ? 'text-yellow-600' : 'text-primary'}`}
          >
            {doc.status}
          </span>
        </div>

        {doc.status === 'COMPLETED' && (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              /* navigate to chat */
            }}
          >
            Open Chat
          </Button>
        )}

        {/* Optional: Allow user to clear and re-upload */}
        {!isProcessing && (
          <Button
            variant="ghost"
            className="w-full text-destructive hover:text-destructive"
            size="sm"
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete and start over
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
