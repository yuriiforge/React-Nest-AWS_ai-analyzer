# AI Chat Backend (NestJS)

A scalable, event-driven server built with **NestJS**, orchestrating document processing and AI interactions using **AWS Step Functions** and **Google Gemini**.

### **Core Capabilities**

- **RAG Pipeline**: Implements Retrieval-Augmented Generation by querying **Pinecone** for context before generating responses with **Gemini**.
- **Serverless Workflows**: Uses **AWS Step Functions** to manage long-running document processing (embedding & indexing) to ensure system reliability.
- **Asynchronous Storage**: Files are managed via **AWS S3**, while chat metadata and user sessions reside in **Amazon DynamoDB**.

## Tech Stack

- **Framework**: [NestJS](https://nestjs.com/) (Node.js)
- **AI Models**: Google Gemini (text-004 for Chat, Embedding-001 for Vectors)
- **Vector DB**: [Pinecone](https://www.pinecone.io/) (Serverless)
- **Cloud Infrastructure**: AWS (S3, DynamoDB, Step Functions)
- **SDKs**: `@aws-sdk/client-s3`, `@aws-sdk/client-dynamodb`, `@google/generative-ai`

## How to run application

1. Copy and paste content of .env.example into .env file and fill with your own values

2. Run command

```bash
npm install
```

3. Run the development server

```bash
npm run dev
```
