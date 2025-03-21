import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/auth/prisma/prisma.service';
import { CreateSubCategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubCategoryDto } from './dto/update-subcategory.dto';
@Injectable()
export class SubCategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateSubCategoryDto) {
    return this.prisma.subCategory.create({ data });
  }

  async findAll() {
    return this.prisma.subCategory.findMany({ include: { category: true } });
  }

  async findOne(id: string) {
    return this.prisma.subCategory.findUnique({
      where: { id },
      include: { category: true },
    });
  }

  async update(id: string, data: UpdateSubCategoryDto) {
    return this.prisma.subCategory.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.subCategory.delete({ where: { id } });
  }
}
