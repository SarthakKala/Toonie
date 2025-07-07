// backend/src/AI/dto/improve-code.dto.ts
import { IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class ImproveCodeDto {
  @IsString()
  @Transform(({ value }) => value.trim())
  code: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  feedback: string;
}