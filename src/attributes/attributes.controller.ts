import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { AttributesService } from './attributes.service';
import { CreateAttributeDto } from './dto/create-attribute.dto';

@Controller('attributes')
export class AttributesController {
  constructor(private readonly attributesService: AttributesService) {}

  // ✅ Add attributes to a MAIN CATEGORY
  @Post('category/:categoryId')
  setCategoryAttributes(
    @Param('categoryId') categoryId: string,
    @Body() createAttributeDto: CreateAttributeDto,
  ) {
    return this.attributesService.setCategoryAttributes(
      categoryId,
      createAttributeDto,
    );
  }

  // ✅ Get attributes for a MAIN CATEGORY
  @Get('category/:categoryId')
  getCategoryAttributes(@Param('categoryId') categoryId: string) {
    return this.attributesService.getCategoryAttributes(categoryId);
  }

  // ✅ Add attributes to a SUB-SUBCATEGORY
  @Post('subcategory/:subSubcategoryId')
  setSubSubcategoryAttributes(
    @Param('subSubcategoryId') subSubcategoryId: string,
    @Body() createAttributeDto: CreateAttributeDto,
  ) {
    return this.attributesService.setSubSubcategoryAttributes(
      subSubcategoryId,
      createAttributeDto,
    );
  }

  // ✅ Get combined attributes (Main Category + SubSubCategory)
  @Get('subcategory/:subSubcategoryId')
  getCombinedAttributes(@Param('subSubcategoryId') subSubcategoryId: string) {
    // return this.attributesService.getCombinedAttributes(subSubcategoryId);
  }
}
