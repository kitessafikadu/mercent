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

@Controller('subsubcategories')
export class SubSubCategoriesController {
  constructor(
    private readonly subSubCategoriesService: SubSubCategoriesService,
  ) {}

  @Post()
  async create(@Body() createSubSubCategoryDto: CreateSubSubCategoryDto) {
    return this.subSubCategoriesService.create(createSubSubCategoryDto);
  }

  @Get()
  async findAll() {
    return this.subSubCategoriesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.subSubCategoriesService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSubSubCategoryDto: UpdateSubSubCategoryDto,
  ) {
    return this.subSubCategoriesService.update(id, updateSubSubCategoryDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.subSubCategoriesService.remove(id);
  }
}
