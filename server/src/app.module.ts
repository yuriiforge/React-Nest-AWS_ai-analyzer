import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DocumentModule } from './modules/documents/document.module';
import { AwsModule } from './lib/aws/aws.module';
import { ConfigModule } from '@nestjs/config';
import { envValidation } from './config/env.validation';
import { configuration } from './config/env.config';
import { UploadsModule } from './modules/common/uploads/uploads.module';
import { ChatModule } from './modules/chat/chat.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
