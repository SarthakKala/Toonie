// backend/src/AI/ai.controller.ts
import { Controller, Post, Get, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AIService } from './ai.service';

@Controller('ai')
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @Post('generate')
  @HttpCode(HttpStatus.OK)
  async generateCode(@Body() body: any) {
    const { prompt, context, model, temperature, maxTokens } = body;
    
    const result = await this.aiService.generateP5Code(prompt, {
      context,
      model,
      temperature,
      maxTokens
    });

    return {
      success: true,
      data: result.data,
      timestamp: new Date().toISOString()
    };
  }

  @Post('improve')
  @HttpCode(HttpStatus.OK)
  async improveCode(@Body() body: any) {
    const { code, feedback } = body;
    
    const result = await this.aiService.improveCode(code, feedback);

    return {
      success: true,
      data: result.data,
      timestamp: new Date().toISOString()
    };
  }

  @Post('chat')
  @HttpCode(HttpStatus.OK)
  async chat(@Body() body: any) {
    const { message, conversationHistory } = body;
    
    const result = await this.aiService.chatWithAI(message, conversationHistory);

    return {
      success: true,
      data: {
        response: result.data?.code,
        usage: result.data?.usage
      },
      timestamp: new Date().toISOString()
    };
  }

  @Get('models')
  async getModels() {
    const models = await this.aiService.getAvailableModels();
    
    return {
      success: true,
      data: models
    };
  }
}