import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { SubSubCategoriesService } from './subsubcategories.service';
import { CreateSubSubCategoryDto } from './dto/create-subsub-category.dto';
import { UpdateSubSubCategoryDto } from './dto/update-subsub-category.dto';

@Controller(
  'categories/:categoryId/subcategories/:subcategoryId/subsubcategories',
) // Nested under subcategories
export class SubSubCategoriesController {
  constructor(
    private readonly subSubCategoriesService: SubSubCategoriesService,
  ) {}

  @Post()
  async create(
    @Param('categoryId') categoryId: string,
    @Param('subcategoryId') subcategoryId: string,
    @Body() createSubSubCategoryDto: CreateSubSubCategoryDto,
  ) {
    return this.subSubCategoriesService.create(
      categoryId,
      subcategoryId,
      createSubSubCategoryDto,
    );
  }

  @Get()
  async findAll(
    @Param('categoryId') categoryId: string,
    @Param('subcategoryId') subcategoryId: string,
  ) {
    return this.subSubCategoriesService.findAll(categoryId, subcategoryId);
  }

  @Get(':id')
  async findOne(
    @Param('categoryId') categoryId: string,
    @Param('subcategoryId') subcategoryId: string,
    @Param('id') id: string,
  ) {
    return this.subSubCategoriesService.findOne(categoryId, subcategoryId, id);
  }

  @Put(':id')
  async update(
    @Param('categoryId') categoryId: string,
    @Param('subcategoryId') subcategoryId: string,
    @Param('id') id: string,
    @Body() updateSubSubCategoryDto: UpdateSubSubCategoryDto,
  ) {
    return this.subSubCategoriesService.update(
      categoryId,
      subcategoryId,
      id,
      updateSubSubCategoryDto,
    );
  }

  @Delete(':id')
  async remove(
    @Param('categoryId') categoryId: string,
    @Param('subcategoryId') subcategoryId: string,
    @Param('id') id: string,
  ) {
    return this.subSubCategoriesService.remove(categoryId, subcategoryId, id);
  }
}
