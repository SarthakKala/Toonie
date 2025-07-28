import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIResponse {
  success: boolean;
  data?: {
    code: string;
    explanation: string;
    model: string;
    usage?: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
  };
  error?: string;
}

export interface GenerateCodeOptions {
  model?: string;
  temperature?: number;
  context?: {
    width?: number;
    height?: number;
    duration?: number;
    style?: string;
  };
}

@Injectable()
export class AIService {
  private readonly logger = new Logger(AIService.name);
  private client: AxiosInstance;
  private defaultModel: string = 'deepseek/deepseek-chat-v3-0324:free';

  constructor(private configService: ConfigService) {
    this.initializeClient();
  }

  private initializeClient() {
    const apiKey = this.configService.get<string>('OPENROUTER_API_KEY');
    const baseURL = this.configService.get<string>('OPENROUTER_BASE_URL', 'https://openrouter.ai/api/v1');
    
    if (!apiKey) {
      throw new Error('OPENROUTER_API_KEY is not configured');
    }

    this.client = axios.create({
      baseURL,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000'),
        'X-Title': 'Naya AI Studio'
      },
      timeout: 30000 // 30 seconds timeout
    });
  }

  async generateP5Code(prompt: string, options: GenerateCodeOptions = {}): Promise<AIResponse> {
    try {
      const {
        model = this.defaultModel,
        temperature = 0.7,
        context = {}
      } = options;

      const systemPrompt = this.createSystemPrompt(context);
      const messages: AIMessage[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ];

      console.log(`🤖 Generating code with prompt: ${prompt}`);
      console.log(`📋 Using model: ${model}`);
      console.log(messages);
      const response = await this.client.post('/chat/completions', {
        model,
        messages,
        temperature,
        stream: false
      });

      const aiResponse = response.data;
      
      if (!aiResponse.choices || aiResponse.choices.length === 0) {
        throw new HttpException('No response generated from AI', HttpStatus.BAD_GATEWAY);
      }

      const generatedContent = aiResponse.choices[0].message.content;
      const extractedCode = this.extractCodeFromResponse(generatedContent);
      const explanation = this.extractExplanation(generatedContent);

      console.log('✅ Code generated successfully');
      console.log(`📊 Token usage: ${JSON.stringify(aiResponse.usage)}`);

      return {
        success: true,
        data: {
          code: extractedCode,
          explanation: explanation,
          model: model,
          usage: aiResponse.usage
        }
      };

    } catch (error) {
      console.error('AI Service Error:', error);
      
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status;
        const errorData = error.response?.data;
        
        if (statusCode === 401) {
          throw new HttpException(
            'Invalid API key. Please check your OpenRouter configuration.',
            HttpStatus.UNAUTHORIZED
          );
        } else if (statusCode === 429) {
          throw new HttpException(
            'Rate limit exceeded. Please try again later.',
            HttpStatus.TOO_MANY_REQUESTS
          );
        } else if (statusCode === 400) {
          throw new HttpException(
            `Invalid request: ${errorData?.error?.message || 'Bad request'}`,
            HttpStatus.BAD_REQUEST
          );
        }
      }

      throw new HttpException(
        error instanceof Error ? error.message : 'Unknown error occurred',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  private createSystemPrompt(context: GenerateCodeOptions['context'] = {}): string {
    const {
      width = 600,
      height = 450,
      duration = 5,
      style = 'modern'
    } = context;

return `You are an expert p5.js developer. Generate clean, complete p5.js code.

REQUIREMENTS:
- Use p5.js instance mode (do NOT use global mode).
- All functions and variables must be attached to the "p" object (e.g., p.setup = function() {...}, p.draw = function() {...}).
- Canvas size: ${width || 600}x${height || 400}
- Animation duration: ${duration} seconds
- Style: ${style}
- Always include complete p.setup and p.draw functions
- Add meaningful comments
- Use smooth animations and good performance

RESPONSE FORMAT:
First, provide a brief explanation of what the animation does.

Then provide the complete code in a single code block like this:

\`\`\`javascript
p.setup = function() {
  p.createCanvas(${width}, ${height});
  // initialization code
};

p.draw = function() {
  // animation code
};
\`\`\`

Make sure the code is complete, uses instance mode, and is runnable.`;
  }

  // Update the extractCodeFromResponse method
  private extractCodeFromResponse(response: string): string {
    console.log('🔍 Full AI Response:', response); // Debug log
    
    // Try to extract code from markdown code blocks
    const codeBlockRegex = /```(?:javascript|js)?\n?([\s\S]*?)```/g;
    const matches = [...response.matchAll(codeBlockRegex)];
    
    if (matches && matches.length > 0) {
      // Get the last code block (usually the main code)
      const lastMatch = matches[matches.length - 1];
      const cleanCode = lastMatch[1].trim();
      console.log('✅ Extracted code:', cleanCode);
      return cleanCode;
    }
    
    // If no code blocks found, look for function definitions
    const functionRegex = /function\s+setup\s*\([^)]*\)\s*{[\s\S]*?(?=\n\n|\n\/\/|$)/;
    const functionMatch = response.match(functionRegex);
    
    if (functionMatch) {
      return functionMatch[0];
    }
    
    // Return the whole response if no specific code structure found
    console.log('⚠️ No code blocks found, returning full response');
    return response;
  }
  
  private extractExplanation(response: string): string {
    // Extract text before the first code block
    const beforeCodeRegex = /^([\s\S]*?)(?:```|function\s+setup)/;
    const match = response.match(beforeCodeRegex);
    
    if (match && match[1]) {
      const explanation = match[1].trim();
      // Remove any "Here's" or similar phrases
      return explanation.replace(/^Here's\s+/i, '').replace(/^This\s+is\s+/i, '');
    }
    
    // Extract any comment lines from the code
    const commentRegex = /\/\/\s*(.+)/g;
    const comments = [...response.matchAll(commentRegex)];
    
    if (comments.length > 0) {
      return comments.map(comment => comment[1]).join(' ');
    }
    
    return 'p5.js animation code generated based on your request.';
  }

  async improveCode(code: string, feedback: string): Promise<AIResponse> {
    try {
      const prompt = `Please improve this p5.js code based on the feedback:

CURRENT CODE:
${code}

FEEDBACK:
${feedback}

Please provide the improved version with explanations of the changes made.`;

      return await this.generateP5Code(prompt);
    } catch (error) {
      throw new HttpException(
        'Failed to improve code',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async chatWithAI(message: string, conversationHistory: AIMessage[] = []): Promise<AIResponse> {
    try {
      const messages: AIMessage[] = [
        {
          role: 'system',
          content: 'You are a helpful AI assistant specialized in p5.js creative coding and web development. Help users with their coding questions, provide explanations, and offer creative suggestions.'
        },
        ...conversationHistory,
        { role: 'user', content: message }
      ];
      console.error(`Chatting with AI: ${messages}`);
      const response = await this.client.post('/chat/completions', {
        model: this.defaultModel,
        messages,
        temperature: 0.8
      });

      const aiResponse = response.data;
      
      return {
        success: true,
        data: {
          code: aiResponse.choices[0].message.content,
          explanation: 'Chat response',
          model: this.defaultModel,
          usage: aiResponse.usage
        }
      };

    } catch (error) {
      throw new HttpException(
        'Chat failed',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getAvailableModels(): Promise<string[]> {
    try {
      const response = await this.client.get('/models');
      return response.data.data.map((model: any) => model.id);
    } catch (error) {
      this.logger.error('Failed to fetch models:', error);
      return [this.defaultModel];
    }
  }
}