export enum DocumentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface IDocument {
  email: string;
  s3Key: string;
  fileName: string;
  status: DocumentStatus;
  updatedAt: string;
}
