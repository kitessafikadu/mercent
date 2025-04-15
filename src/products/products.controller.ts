import {
  Controller,
  Get,
  Req,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { BadRequestException } from '@nestjs/common';
import { AuthenticatedRequest } from 'src/types/express';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CloudinaryService } from 'src/config/cloudinary.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('image')) // Add this line
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
          enum: ['ECOMMERCE', 'BROKERAGE', 'SERVICE'],
          example: 'ECOMMERCE',
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
    @Body() createProductDto: CreateProductDto, // This captures all form fields
    @Req() req: AuthenticatedRequest,
  ) {
    const imageUrl = file
      ? await this.cloudinaryService.uploadImage(file)
      : undefined;

    return this.productsService.create(
      { ...createProductDto, imageUrl },
      req.user.userId,
    );
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
