import { BadRequestException, Injectable } from '@nestjs/common';
import { S3Service } from '../../lib/aws/s3.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { DocumentStatus, IDocument } from './document.interface';
import { StepFunctionsService } from '../../lib/aws/step-functions.service';
import { VectorStoreService } from '../../lib/pinecone/vector-store.service';
import { DocumentsRepository } from './documents.repository';

@Injectable()
export class DocumentService {
  constructor(
    private readonly s3Service: S3Service,
    private readonly stepFunctionsService: StepFunctionsService,
    private readonly vectorStoreService: VectorStoreService,
    private readonly documentsRepo: DocumentsRepository,
  ) {}

  async createDocument(dto: CreateDocumentDto) {
    const { email, fileName, s3Key } = dto;

    const fileMetadata = await this.s3Service.getFileMetadata(s3Key);
    if (!fileMetadata) {
      throw new BadRequestException('File not found in staging area.');
    }

    const existingDoc = await this.documentsRepo.findOne({ email });

    const permanentKey = `documents/${email}/${Date.now()}-${fileName}`;

    await this.s3Service.moveObject(s3Key, permanentKey);

    const documentRecord: IDocument = {
      email,
      fileName,
      s3Key: permanentKey,
      status: DocumentStatus.PENDING,
      updatedAt: new Date().toISOString(),
    };

    await this.documentsRepo.create(documentRecord);

    if (existingDoc?.s3Key) {
      this.s3Service
        .deleteObject(existingDoc.s3Key)
        .catch((err) =>
          console.error(
            `Post-upload cleanup failed for ${existingDoc.s3Key}`,
            err,
          ),
        );
    }

    await this.stepFunctionsService.startProcessing(email, permanentKey);

    return documentRecord;
  }

  async find(email: string) {
    const document = await this.documentsRepo.findOne({ email });

    if (!document) {
      return null;
    }

    return document;
  }

  async remove(email: string) {
    const doc = await this.documentsRepo.findOne({ email });

    if (!doc) {
      return { success: true, message: 'No document found' };
    }

    try {
      await Promise.all([
        this.s3Service.deleteObject(doc.s3Key),
        this.documentsRepo.delete({ email }),
        this.vectorStoreService.deleteNamespace(email),
      ]);

      return { success: true };
    } catch (error) {
      console.error(`Failed to fully clean up resources for ${email}:`, error);
      throw error;
    }
  }
}
