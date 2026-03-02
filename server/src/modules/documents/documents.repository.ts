import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { IDocument } from './document.interface';
import { DynamoService } from '../../lib/aws/dynamo-db.service';
import { AbstractDynamoRepository } from '../../lib/aws/abstract-dynamo-repository';
import { EnvConfig } from '../../config/env.config';

@Injectable()
export class DocumentsRepository extends AbstractDynamoRepository<IDocument> {
  constructor(dynamo: DynamoService, config: ConfigService<EnvConfig>) {
    super(
      dynamo.docClient,
      config.get('aws.dynamoDbTableName', { infer: true })!,
    );
  }

  async updateStatus(email: string, status: string) {
    return this.docClient.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: { email },
        UpdateExpression: 'set #status = :s, updatedAt = :u',
        ExpressionAttributeNames: { '#status': 'status' },
        ExpressionAttributeValues: {
          ':s': status,
          ':u': new Date().toISOString(),
        },
      }),
    );
  }
}
