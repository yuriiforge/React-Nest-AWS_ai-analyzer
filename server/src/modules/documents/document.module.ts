import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { DocumentsRepository } from './documents.repository';

@Module({
  imports: [],
  providers: [DocumentService, DocumentsRepository],
  controllers: [DocumentController],
})
export class DocumentModule {}
