import { Injectable } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';
import { EnvConfig } from '../../config/env.config';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DynamoService {
  private readonly docClient: DynamoDBDocumentClient;
  private readonly tableName: string;

  constructor(private configService: ConfigService<EnvConfig>) {
    const awsConfig = this.configService.get('aws', { infer: true })!;

    const client = new DynamoDBClient({
      region: awsConfig.region!,
      credentials: {
        accessKeyId: awsConfig.accessKeyId!,
        secretAccessKey: awsConfig.accessKey!,
      },
    });

    this.docClient = DynamoDBDocumentClient.from(client);
    this.tableName = awsConfig.dynamoDbTableName!;
  }

  async saveItem(item: Record<string, any>) {
    return this.docClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: item,
      }),
    );
  }

  async getItem<T>(key: Record<string, any>): Promise<T | null> {
    const response = await this.docClient.send(
      new GetCommand({
        TableName: this.tableName,
        Key: key,
      }),
    );
    return response.Item as T;
  }

  // email - is partition key name I created in AWS console
  async updateItem(email: string, status: string) {
    const command = new UpdateCommand({
      TableName: this.tableName,
      Key: { email },
      UpdateExpression: 'set #status = :s, updatedAt = :u',
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':s': status,
        ':u': new Date().toISOString(),
      },
    });

    return this.docClient.send(command);
  }

  async deleteItem(email: string) {
    const command = new DeleteCommand({
      TableName: this.tableName,
      Key: { email },
    });

    return this.docClient.send(command);
  }
}
