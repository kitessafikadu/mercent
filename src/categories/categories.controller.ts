import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/config/cloudinary.service';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image')) // Handles file upload with 'image' field
  @ApiConsumes('multipart/form-data') // Specifies form-data for file upload
  @ApiBody({
    description: 'Create Category with Image',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Shoes' },
        description: {
          type: 'string',
          example: 'A category for various types of shoes',
        },
        attributes: {
          type: 'array',
          items: { type: 'string' },
          example: ['color', 'size'],
        },
        image: { type: 'string', format: 'binary' }, // File upload input
      },
    },
  })
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    const imageUrl = file
      ? await this.cloudinaryService.uploadImage(file)
      : undefined;

    return this.categoriesService.create({
      ...createCategoryDto,
      imageUrl, // Pass the image URL from Cloudinary
    });
  }

  @Get()
  findAll() {
    return this.categoriesService.findAll(); // Fetches all categories with subcategories & sub-subcategories
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image')) // Handles file upload with 'image' field
  @ApiConsumes('multipart/form-data') // Specifies form-data for file upload
  @ApiBody({
    description: 'Update Category with Image',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Shoes' },
        description: {
          type: 'string',
          example: 'A category for various types of shoes',
        },
        attributes: {
          type: 'array',
          items: { type: 'string' },
          example: ['color', 'size'],
        },
        image: { type: 'string', format: 'binary' }, // File upload input
      },
    },
  })
  async update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const imageUrl = file
      ? await this.cloudinaryService.uploadImage(file)
      : undefined;

    return this.categoriesService.update(id, {
      ...updateCategoryDto,
      imageUrl, // If there's an image uploaded, we'll pass it as part of the update
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
