import { Injectable } from '@nestjs/common';
import { S3Service } from '../../lib/aws/s3.service';
import { GetUploadUrlDto } from './dto/get-uploads-url.dto';

@Injectable()
export class UploadsService {
  constructor(private readonly s3Service: S3Service) {}

  async getPresignedUrl(dto: GetUploadUrlDto) {
    const fileId = crypto.randomUUID();
    const s3Key = `tmp/${dto.email}/${fileId}-${dto.fileName}`;

    const uploadUrl = await this.s3Service.getPresignedUploadUrl(
      s3Key,
      'application/pdf',
    );

    return { uploadUrl, s3Key };
  }
}
