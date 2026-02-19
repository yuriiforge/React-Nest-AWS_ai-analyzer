import type { DocumentStatusType } from '@/constants/document_status';

export type DocumentStatus =
  (typeof DocumentStatusType)[keyof typeof DocumentStatusType];
export interface Document {
  id: string; // The database primary key (e.g., UUID)
  email: string; // The owner's email (used for Pinecone namespace)
  fileName: string; // Original name (e.g., "resume.pdf")
  s3Key: string; // The path in your AWS S3 bucket
  status: DocumentStatus; // Using our type-safe union
  createdAt: string; // ISO string for sorting/display
  updatedAt: string;
}
