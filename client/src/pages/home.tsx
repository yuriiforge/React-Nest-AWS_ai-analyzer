import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, FileUp, CheckCircle } from 'lucide-react';
import { useUploadDocument } from '@/api/hooks/useUploadDocument';

const HomePage = () => {
  const navigate = useNavigate();
  const { mutate: upload, isPending, isSuccess, error } = useUploadDocument();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    upload(selectedFile, {
      onSuccess: (data) => {
        setTimeout(() => navigate(`/status/${data.email}`), 1500);
      },
    });
  };

  return (
    <div className="container max-w-2xl py-10 mx-auto">
      <Card className="border-dashed border-2">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Upload PDF</CardTitle>
          <CardDescription>
            Max 10MB. Only PDF files are supported.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <FileUp className="w-10 h-10 mb-3 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {selectedFile ? selectedFile.name : 'Click to select a file'}
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
            <p className="text-sm text-destructive font-medium">
              {error.message || 'Upload failed'}
            </p>
          )}

          <Button
            className="w-full"
            disabled={!selectedFile || isPending || isSuccess}
            onClick={handleUpload}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
              </>
            ) : isSuccess ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" /> Success!
              </>
            ) : (
              'Start Processing'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomePage;
