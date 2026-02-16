import { BadRequestException, Injectable } from '@nestjs/common';
import { S3Service } from '../../lib/aws/s3.service';
import { DynamoService } from '../../lib/aws/dynamo-db.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { DocumentStatus } from './document.interface';

@Injectable()
export class DocumentService {
  constructor(
    private readonly s3Service: S3Service,
    private readonly dynamoService: DynamoService,
  ) {}

  async createDocument(dto: CreateDocumentDto) {
    const { email, fileName, s3Key } = dto;

    const fileMetadata = await this.s3Service.getFileMetadata(s3Key);
    if (!fileMetadata) {
      throw new BadRequestException('File not found in staging area.');
    }

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

    //TODO trigger step function

    return documentRecord;
  }
}
