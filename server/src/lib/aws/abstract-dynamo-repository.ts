import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';

export abstract class AbstractDynamoRepository<T extends Record<string, any>> {
  protected constructor(
    protected readonly docClient: DynamoDBDocumentClient,
    protected readonly tableName: string,
  ) {}

  async findOne(key: Record<string, any>): Promise<T | null> {
    const response = await this.docClient.send(
      new GetCommand({
        TableName: this.tableName,
        Key: key,
      }),
    );
    return (response.Item as T) || null;
  }

  async create(item: T): Promise<void> {
    await this.docClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: item,
      }),
    );
  }

  async delete(key: Record<string, any>): Promise<void> {
    await this.docClient.send(
      new DeleteCommand({
        TableName: this.tableName,
        Key: key,
      }),
    );
  }
}
