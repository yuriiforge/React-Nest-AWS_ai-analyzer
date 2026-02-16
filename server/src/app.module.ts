import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DocumentModule } from './modules/documents/document.module';
import { AwsModule } from './lib/aws/aws.module';

@Module({
  imports: [DocumentModule, AwsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
