import { SFNClient, StartExecutionCommand } from '@aws-sdk/client-sfn';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from '../../config/env.config';

@Injectable()
export class StepFunctionsService {
  private readonly client: SFNClient;
  private readonly stateMachineArn: string;

  constructor(private configService: ConfigService<EnvConfig>) {
    this.client = new SFNClient({
      region: this.configService.get('aws.region', { infer: true })!,
      credentials: {
        accessKeyId: this.configService.get('aws.accessKeyId', {
          infer: true,
        })!,
        secretAccessKey: this.configService.get('aws.accessKey', {
          infer: true,
        })!,
      },
    });
    this.stateMachineArn = this.configService.get('aws.stateMachine', {
      infer: true,
    })!;
  }

  async startProcessing(email: string, s3Key: string) {
    const input = JSON.stringify({ email, s3Key });

    const executionName = `proc-${email.replace(/[@.]/g, '-')}-${Date.now()}`;

    try {
      const command = new StartExecutionCommand({
        stateMachineArn: this.stateMachineArn,
        input,
        name: executionName,
      });

      const response = await this.client.send(command);
      console.log(`Pipeline started: ${response.executionArn}`);
      return response;
    } catch (error) {
      console.error('Failed to trigger Step Function:', error);
      throw new InternalServerErrorException(
        'AI processing pipeline failed to start',
      );
    }
  }
}
