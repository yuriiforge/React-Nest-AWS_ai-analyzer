import { Global, Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { DynamoService } from './dynamo-db.service';
import { StepFunctionsService } from './step-functions.service';

@Global()
@Module({
  providers: [S3Service, DynamoService, StepFunctionsService],
  exports: [S3Service, DynamoService, StepFunctionsService],
})
export class AwsModule {}
