import { BadRequestException, Injectable } from '@nestjs/common';
import { S3Service } from '../../lib/aws/s3.service';
import { DynamoService } from '../../lib/aws/dynamo-db.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { DocumentStatus, IDocument } from './document.interface';
import { StepFunctionsService } from '../../lib/aws/step-functions.service';
import { VectorStoreService } from '../../lib/pinecone/vector-store.service';

@Injectable()
export class DocumentService {
  constructor(
    private readonly s3Service: S3Service,
    private readonly dynamoService: DynamoService,
    private readonly stepFunctionsService: StepFunctionsService,
    private readonly vectorStoreService: VectorStoreService,
  ) {}

  async createDocument(dto: CreateDocumentDto) {
    const { email, fileName, s3Key } = dto;

    const fileMetadata = await this.s3Service.getFileMetadata(s3Key);
    if (!fileMetadata) {
      throw new BadRequestException('File not found in staging area.');
    }

    const existingDoc = await this.dynamoService.getItem<IDocument>({ email });

    const permanentKey = `documents/${email}/${Date.now()}-${fileName}`;

    await this.s3Service.moveObject(s3Key, permanentKey);

    const documentRecord = {
      email,
      fileName,
      s3Key: permanentKey,
      status: DocumentStatus.PENDING,
      createdAt: new Date().toISOString(),
    };

    await this.dynamoService.saveItem(documentRecord);

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

  async getOne(email: string) {
    const document = await this.dynamoService.getItem({ email });

    if (!document) {
      return null;
    }

    return document;
  }

  async remove(email: string) {
    const doc = await this.dynamoService.getItem<IDocument>({ email });

    if (!doc) {
      return { success: true, message: 'No document found' };
    }

    try {
      await Promise.all([
        this.s3Service.deleteObject(doc.s3Key),
        this.dynamoService.deleteItem(email),
        this.vectorStoreService.deleteNamespace(email),
      ]);

      return { success: true };
    } catch (error) {
      console.error(`Failed to fully clean up resources for ${email}:`, error);
      throw error;
    }
  }
}
