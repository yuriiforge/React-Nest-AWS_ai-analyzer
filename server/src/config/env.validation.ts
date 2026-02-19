import * as Joi from 'joi';

export const envValidation = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3000),

  // AWS Configuration
  AWS_REGION: Joi.string().required(),
  AWS_ACCESS_KEY_ID: Joi.string().required(),
  AWS_SECRET_ACCESS_KEY: Joi.string().required(),

  // Resource Names
  AWS_S3_BUCKET: Joi.string().required(),
  DYNAMODB_TABLE_NAME: Joi.string().required(),
  AWS_STATE_MACHINE_ARN: Joi.string().required(),

  PINECONE_API_KEY: Joi.string().required(),
  PINECONE_INDEX: Joi.string().required(),
  EMBEDDING_DIMENSIONS: Joi.number().required(),

  GEMINI_API_KEY: Joi.string().required(),
  GEMINI_CHAT_MODEL: Joi.string().required(),
  GEMINI_EMBEDDING_MODEL: Joi.string().required(),
});
