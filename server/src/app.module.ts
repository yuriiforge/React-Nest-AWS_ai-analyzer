import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DocumentModule } from './modules/documents/document.module';
import { AwsModule } from './lib/aws/aws.module';
import { ConfigModule } from '@nestjs/config';
import { envValidation } from './config/env.validation';
import { configuration } from './config/env.config';
import { ChatModule } from './modules/chat/chat.module';
import { PineconeModule } from './lib/pinecone/pinecone.module';
import { UploadsModule } from './modules/uploads/uploads.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidation,
      load: [configuration],
    }),
    DocumentModule,
    AwsModule,
    UploadsModule,
    ChatModule,
    PineconeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
