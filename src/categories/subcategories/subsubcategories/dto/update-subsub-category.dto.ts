import { PartialType } from '@nestjs/mapped-types';
import { CreateSubSubCategoryDto } from './create-subsub-category.dto';

export class UpdateSubSubCategoryDto extends PartialType(
  CreateSubSubCategoryDto,
) {}
