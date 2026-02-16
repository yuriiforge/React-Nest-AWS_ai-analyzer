import { Global, Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { DynamoService } from './dynamo-db.service';

@Global()
@Module({
  providers: [S3Service, DynamoService],
  exports: [S3Service, DynamoService],
})
export class AwsModule {}
