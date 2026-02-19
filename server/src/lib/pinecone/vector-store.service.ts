import { Injectable, OnModuleInit } from '@nestjs/common';
import { Pinecone } from '@pinecone-database/pinecone';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from '../../config/env.config';

@Injectable()
export class VectorStoreService implements OnModuleInit {
  private pinecone: Pinecone;
  private indexName: string;

  constructor(private configService: ConfigService<EnvConfig>) {
    this.pinecone = new Pinecone({
      apiKey: this.configService.get<string>('pinecone.apiKey', {
        infer: true,
      })!,
    });
    this.indexName = this.configService.get('pinecone.index', { infer: true })!;
  }

  onModuleInit() {
    if (!this.indexName) {
      throw new Error('PINECONE_INDEX is not defined in environment variables');
    }
  }

  async deleteNamespace(namespace: string) {
    const index = this.pinecone.index(this.indexName);
    await index.namespace(namespace).deleteAll();
  }
}
