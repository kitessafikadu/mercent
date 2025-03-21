import { IsString, IsOptional, IsObject } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsObject()
  attributes?: Record<string, any>; // Add this line to fix the issue
}
