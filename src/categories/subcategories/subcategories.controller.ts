import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SubCategoriesService } from './subcategories.service';
import { CreateSubCategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubCategoryDto } from './dto/update-subcategory.dto';

@Controller('categories/:categoryId/subcategories') // Nested under categories
export class SubCategoriesController {
  constructor(private readonly subCategoriesService: SubCategoriesService) {}

  @Post()
  create(
    @Param('categoryId') categoryId: string,
    @Body() createSubCategoryDto: CreateSubCategoryDto,
  ) {
    return this.subCategoriesService.create(categoryId, createSubCategoryDto);
  }

  @Get()
  async getAll() {
    return this.subCategoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('categoryId') categoryId: string, @Param('id') id: string) {
    return this.subCategoriesService.findOne(categoryId, id);
  }

  @Patch(':id')
  update(
    @Param('categoryId') categoryId: string,
    @Param('id') id: string,
    @Body() updateSubCategoryDto: UpdateSubCategoryDto,
  ) {
    return this.subCategoriesService.update(
      categoryId,
      id,
      updateSubCategoryDto,
    );
  }

  @Delete(':id')
  remove(@Param('categoryId') categoryId: string, @Param('id') id: string) {
    return this.subCategoriesService.remove(categoryId, id);
  }
}
