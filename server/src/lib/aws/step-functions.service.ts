import { SFNClient, StartExecutionCommand } from '@aws-sdk/client-sfn';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StepFunctionsService {
  private readonly client: SFNClient;
  private readonly stateMachineArn: string;

  constructor(private configService: ConfigService) {
    this.client = new SFNClient({
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID')!,
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY')!,
      },
    });
    this.stateMachineArn = this.configService.get('AWS_STATE_MACHINE_ARN')!;
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
