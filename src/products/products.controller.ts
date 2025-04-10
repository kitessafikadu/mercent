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
import { ApiConsumes, ApiBody } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CloudinaryService } from 'src/config/cloudinary.service';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Create Product with Image',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'iPhone 15' },
        price: { type: 'number', example: 1200 },
        listingType: {
          type: 'string',
          enum: ['SELL', 'RENT', 'SERVICE'],
          example: 'SELL',
        },
        subSubcategoryId: { type: 'string' },
        description: { type: 'string', example: 'A premium Apple smartphone' },
        attributes: {
          type: 'object',
          example: { color: 'black', storage: '128GB' },
        },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createProductDto: CreateProductDto,
  ) {
    const imageUrl = file
      ? await this.cloudinaryService.uploadImage(file)
      : undefined;

    return this.productsService.create({
      ...createProductDto,
      imageUrl,
    });
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Update Product with Image',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        price: { type: 'number' },
        listingType: { type: 'string', enum: ['SELL', 'RENT', 'SERVICE'] },
        subSubcategoryId: { type: 'string' },
        description: { type: 'string' },
        attributes: { type: 'object' },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  async update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const imageUrl = file
      ? await this.cloudinaryService.uploadImage(file)
      : undefined;

    return this.productsService.update(id, {
      ...updateProductDto,
      imageUrl,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
