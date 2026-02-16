export const configuration = () => ({
  nodeEnv: process.env.NODE_ENV,
  port: parseInt(process.env.PORT!, 10) || 3000,
  clientUrl: process.env.CLIENT_URL,
  aws: {
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    accessKey: process.env.AWS_SECRET_ACCESS_KEY,
    s3Bucket: process.env.AWS_S3_BUCKET,
  },
});

export type EnvConfig = ReturnType<typeof configuration>;
