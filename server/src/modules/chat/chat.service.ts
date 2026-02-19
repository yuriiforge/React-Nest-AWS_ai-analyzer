import { Injectable } from '@nestjs/common';
import { Pinecone, RecordMetadata } from '@pinecone-database/pinecone';
import {
  EmbedContentRequest,
  GenerativeModel,
  GoogleGenerativeAI,
  TaskType,
} from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from '../../config/env.config';

interface VectorMetadata extends RecordMetadata {
  text: string;
  email: string;
  timestamp: string;
}

interface EnhancedEmbedRequest extends EmbedContentRequest {
  outputDimensionality?: number;
}

@Injectable()
export class ChatService {
  private pc: Pinecone;
  private genAI: GoogleGenerativeAI;
  private dimensions: number;

  constructor(private readonly configService: ConfigService<EnvConfig>) {
    this.pc = new Pinecone({
      apiKey: configService.get('pinecone.apiKey', { infer: true })!,
    });
    this.genAI = new GoogleGenerativeAI(
      configService.get('gemini.apiKey', { infer: true })!,
    );
    this.dimensions = parseInt(
      configService.get('pinecone.dimensions', { infer: true })!,
    );
  }

  getChatModel(): GenerativeModel {
    const modelName = this.configService.get('gemini.chatModel', {
      infer: true,
    })!;
    return this.genAI.getGenerativeModel({
      model: modelName,
      systemInstruction:
        'You are a helpful assistant. Use the provided context to answer questions accurately.',
    });
  }

  async getContext(email: string, question: string): Promise<string> {
    const embeddingModel = this.configService.get('gemini.embeddingModel', {
      infer: true,
    })!;
    const pIndex = this.configService.get('pinecone.index', { infer: true })!;
    const model = this.genAI.getGenerativeModel({
      model: embeddingModel,
    });

    const request: EnhancedEmbedRequest = {
      content: { role: 'user', parts: [{ text: question }] },
      taskType: TaskType.RETRIEVAL_QUERY,
      outputDimensionality: this.dimensions,
    };

    const embedding = await model.embedContent(request);

    const index = this.pc.index<VectorMetadata>({ name: pIndex });
    const result = await index.namespace(email).query({
      vector: embedding.embedding.values,
      topK: 5,
      includeMetadata: true,
    });

    console.log(`Searching Pinecone namespace: "${email}"`);
    console.log(`Found ${result.matches.length} matches`);

    return result.matches
      .map((m) => m.metadata?.text)
      .filter((text): text is string => !!text)
      .join('\n\n');
  }

  async getGeminiStream(question: string, context: string) {
    const model = this.getChatModel();
    const prompt = `Context from uploaded document:\n${context}\n\nUser Question: ${question}`;

    return model.generateContentStream(prompt);
  }
}
