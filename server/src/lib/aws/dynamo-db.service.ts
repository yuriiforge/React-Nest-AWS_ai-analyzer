import { Injectable } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { EnvConfig } from '../../config/env.config';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DynamoService {
  public readonly docClient: DynamoDBDocumentClient;
  private readonly client: DynamoDBClient;

  constructor(private configService: ConfigService<EnvConfig>) {
    const awsConfig = this.configService.get('aws', { infer: true })!;

    this.client = new DynamoDBClient({
      region: awsConfig.region!,
      credentials: {
        accessKeyId: awsConfig.accessKeyId!,
        secretAccessKey: awsConfig.accessKey!,
      },
    });

    this.docClient = DynamoDBDocumentClient.from(this.client);
  }
}
