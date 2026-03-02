import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { GetStatusDto } from './dto/get-status.dto';

@Controller('documents')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post()
  async create(@Body() createDocumentDto: CreateDocumentDto) {
    return this.documentService.createDocument(createDocumentDto);
  }

  @Get('status')
  async getStatus(@Query() query: GetStatusDto) {
    const doc = await this.documentService.find(query.email);

    return doc || { status: 'NO_DOCUMENT' };
  }

  @Delete()
  async remove(@Query('email') email: string) {
    return this.documentService.remove(email);
  }
}
