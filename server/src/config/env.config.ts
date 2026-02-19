export const configuration = () => ({
  nodeEnv: process.env.NODE_ENV,
  port: parseInt(process.env.PORT!, 10) || 3000,
  clientUrl: process.env.CLIENT_URL,
  aws: {
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    accessKey: process.env.AWS_SECRET_ACCESS_KEY,
    s3Bucket: process.env.AWS_S3_BUCKET,
    dynamoDbTableName: process.env.DYNAMODB_TABLE_NAME,
    stateMachine: process.env.AWS_STATE_MACHINE_ARN,
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    chatModel: process.env.GEMINI_CHAT_MODEL,
    embeddingModel: process.env.GEMINI_EMBEDDING_MODEL,
  },
  pinecone: {
    apiKey: process.env.PINECONE_API_KEY,
    index: process.env.PINECONE_INDEX,
    dimensions: process.env.EMBEDDING_DIMENSIONS,
  },
});

export type EnvConfig = ReturnType<typeof configuration>;
