import { Body, Controller, Post, Res } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Request, type Response } from 'express';

@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('message')
  async handleMessage(
    @Body() body: { question: string; email: string },
    @Res() res: Response,
  ) {
    console.log(body.email);
    const context = await this.chatService.getContext(
      body.email,
      body.question,
    );

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');

    const result = await this.chatService.getGeminiStream(
      body.question,
      context,
    );

    for await (const chunk of result.stream) {
      const text = chunk.text();
      res.write(text);
    }

    res.end();
  }
}
