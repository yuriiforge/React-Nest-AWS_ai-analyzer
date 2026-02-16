import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';

@Controller('documents')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post()
  async create(@Body() createDocumentDto: CreateDocumentDto) {
    return this.documentService.createDocument(createDocumentDto);
  }

  @Get('status')
  async getStatus(@Query('email') email: string) {
    if (!email) {
      throw new BadRequestException('Email query parameter is required');
    }

    const doc = await this.documentService.getOne(email);

    return doc || { status: 'NO_DOCUMENT' };
  }
}
