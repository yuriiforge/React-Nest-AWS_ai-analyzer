import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, FileUp, CheckCircle } from 'lucide-react';

interface UploadCardProps {
  selectedFile: File | null;
  isPending: boolean;
  isSuccess: boolean;
  error: Error | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUpload: () => void;
}

export const UploadCard = ({
  selectedFile,
  isPending,
  isSuccess,
  error,
  onFileChange,
  onUpload,
}: UploadCardProps) => {
  return (
    <Card className="border-dashed border-2 shadow-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Document Uploader</CardTitle>
        <CardDescription>
          Upload a PDF to startlet ai analyze and talk about your data.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer hover:bg-accent/50 transition-all border-muted-foreground/20">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <FileUp className="w-12 h-12 mb-4 text-primary/60" />
            <p className="text-sm font-medium">
              {selectedFile ? selectedFile.name : 'Click to select PDF'}
            </p>
          </div>
          <input
            type="file"
            className="hidden"
            accept=".pdf"
            onChange={onFileChange}
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
          disabled={!selectedFile || isPending}
          onClick={onUpload}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Uploading...
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
  );
};
