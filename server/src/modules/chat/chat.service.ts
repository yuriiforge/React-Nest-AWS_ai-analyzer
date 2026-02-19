import { Injectable } from '@nestjs/common';
import { Pinecone, RecordMetadata } from '@pinecone-database/pinecone';
import {
  GenerativeModel,
  GoogleGenerativeAI,
  TaskType,
} from '@google/generative-ai';

interface VectorMetadata extends RecordMetadata {
  text: string;
  email: string;
  timestamp: string;
}

@Injectable()
export class ChatService {
  private pc: Pinecone;
  private genAI: GoogleGenerativeAI;

  constructor() {
    const pineconeKey = process.env.PINECONE_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    if (!pineconeKey) {
      throw new Error('PINECONE_API_KEY is missing');
    }

    if (!geminiKey) {
      throw new Error('GEMINI_API_KEY is missing');
    }

    this.pc = new Pinecone({ apiKey: pineconeKey });
    this.genAI = new GoogleGenerativeAI(geminiKey);
  }

  getChatModel(): GenerativeModel {
    return this.genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-lite',
      systemInstruction:
        'You are a helpful assistant. Use the provided context to answer questions accurately.',
    });
  }

  async getContext(email: string, question: string): Promise<string> {
    const model = this.genAI.getGenerativeModel({
      model: 'gemini-embedding-001',
    });

    const embedding = await model.embedContent({
      content: { role: 'user', parts: [{ text: question }] },
      taskType: TaskType.RETRIEVAL_QUERY,
      outputDimensionality: 1024,
    } as any);

    const index = this.pc.index<VectorMetadata>(process.env.PINECONE_INDEX!);
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
