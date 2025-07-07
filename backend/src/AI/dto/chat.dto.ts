// backend/src/AI/dto/chat.dto.ts
import { IsString, IsOptional, IsArray, IsIn } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class ChatMessageDto {
  @IsString()
  @IsIn(['user', 'assistant'])
  role: 'user' | 'assistant';

  @IsString()
  content: string;
}

export class ChatDto {
  @IsString()
  @Transform(({ value }) => value.trim())
  message: string;

  @IsOptional()
  @IsArray()
  @Type(() => ChatMessageDto)
  conversationHistory?: ChatMessageDto[];
}