// backend/src/AI/dto/generate-code.dto.ts
import { IsString, IsOptional, IsNumber, IsIn, Min, Max, IsObject } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class GenerateCodeContextDto {
  @IsOptional()
  @IsNumber()
  @Min(100)
  @Max(1920)
  width?: number = 400;

  @IsOptional()
  @IsNumber()
  @Min(100)
  @Max(1080)
  height?: number = 300;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(60)
  duration?: number = 5;

  @IsOptional()
  @IsString()
  @IsIn(['modern', 'classic', 'abstract', 'minimalist', 'colorful'])
  style?: string = 'modern';
}

export class GenerateCodeDto {
  @IsString()
  @Transform(({ value }) => value.trim())
  prompt: string;

  @IsOptional()
  @IsObject()
  @Type(() => GenerateCodeContextDto)
  context?: GenerateCodeContextDto;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(2)
  temperature?: number = 0.7;

  @IsOptional()
  @IsNumber()
  @Min(100)
  @Max(4000)
  maxTokens?: number = 2000;
}