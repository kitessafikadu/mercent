import {
  IsString,
  IsOptional,
  IsUUID,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class AttributeDto {
  @IsString()
  name: string;
}

export class CreateSubSubCategoryDto {
  @IsString()
  name: string;

  @IsUUID()
  subCategoryId: string; // Link to SubCategory

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttributeDto)
  attributes?: AttributeDto[]; // Array of attribute names
}
