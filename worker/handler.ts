const pdf = require('pdf-parse/lib/pdf-parse.js');
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Pinecone } from '@pinecone-database/pinecone';

// init
const s3 = new S3Client({});
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({
  model: 'gemini-embedding-001',
});
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });

interface PipelineEvent {
  s3Key: string;
  email: string;
}

interface ExtractionResult extends PipelineEvent {
  rawText: string;
}

type VectorMetadata = {
  text: string;
  email: string;
  timestamp: string;
};

interface EmbeddingsEvent {
  rawText: string;
  email: string;
}

// --- LAMBDA 1: Text Extractor ---
export const extractText = async (
  event: PipelineEvent,
): Promise<ExtractionResult> => {
  const { s3Key, email } = event;
  const response = await s3.send(
    new GetObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: s3Key,
    }),
  );

  if (!response.Body) {
    throw new Error(`The file at ${s3Key} is empty or inaccessible.`);
  }

  const uint8Data = await response.Body.transformToByteArray();
  const data = await pdf(Buffer.from(uint8Data));

  let rawText = '';

  if (data.pages && data.pages.length > 0) {
    rawText = data.pages.map((page: any) => page.text).join(' ');
  } else {
    rawText = data.text;
  }

  return {
    rawText: rawText.replace(/\0/g, ''),
    email,
    s3Key,
  };
};

// --- LAMBDA 2: AI Processing ---
export const processEmbeddings = async (event: any) => {
  const { rawText, email } = event;
  const index = pc.index<VectorMetadata>(process.env.PINECONE_INDEX!);

  const chunks =
    rawText
      .match(/[\s\S]{1,1000}/g)
      ?.filter((c: string) => c.trim().length > 0) || [];
  if (chunks.length === 0) return { email, status: 'SKIPPED' };

  try {
    const result = await model.batchEmbedContents({
      requests: chunks.map((text: string) => ({
        content: { role: 'user', parts: [{ text }] },

        outputDimensionality: 1024,
        taskType: 'RETRIEVAL_DOCUMENT' as any,
      })),
    });

    const timestamp = new Date().toISOString();

    const records = result.embeddings.map((emb, i) => ({
      id: `${email}-${Date.now()}-${i}`,
      values: emb.values,
      metadata: {
        text: chunks[i],
        email,
        timestamp,
      },
    }));

    await index.namespace(email).upsert({ records });

    return { email, status: 'COMPLETED' };
  } catch (error: any) {
    console.error('Embedding Error:', error.message);
    throw new Error(`Gemini Pipeline Failed: ${error.message}`);
  }
};

interface StatusUpdateEvent {
  email: string;
  status: 'COMPLETED' | 'FAILED' | 'PROCESSING';
}
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

// --- LAMBDA 3: Finalizer ---
export const updateStatus = async (
  event: StatusUpdateEvent,
): Promise<{ success: boolean }> => {
  const { email, status } = event;

  if (!process.env.DYNAMODB_TABLE) {
    throw new Error('DYNAMODB_TABLE environment variable is missing');
  }

  try {
    await docClient.send(
      new UpdateCommand({
        TableName: process.env.DYNAMODB_TABLE,
        Key: { email },
        UpdateExpression: 'set #s = :s, updatedAt = :u',
        ExpressionAttributeNames: {
          '#s': 'status',
        },
        ExpressionAttributeValues: {
          ':s': status,
          ':u': new Date().toISOString(),
        },
      }),
    );

    console.log(`[Finalizer] Status updated to ${status} for ${email}`);

    return { success: true };
  } catch (error: any) {
    console.error(`[Finalizer Error] for ${email}:`, error);
    throw new Error(`Failed to update DynamoDB status: ${error.message}`);
  }
};
