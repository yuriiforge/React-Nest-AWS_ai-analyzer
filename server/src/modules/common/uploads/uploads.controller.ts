import { Body, Controller, Post } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { GetUploadUrlDto } from './dto/get-uploads-url.dto';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('presigned-url')
  async getUrl(@Body() dto: GetUploadUrlDto) {
    return this.uploadsService.getPresignedUrl(dto);
  }
}
