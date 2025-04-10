import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';

@Injectable()
export class SubcategoriesService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateSubcategoryDto) {
    return this.prisma.subcategory.create({
      data: dto,
    });
  }

  findAll() {
    return this.prisma.subcategory.findMany({
      include: {
        children: true, // Include child subcategories for recursion
      },
    });
  }

  findOne(id: string) {
    return this.prisma.subcategory.findUnique({
      where: { id },
      include: {
        children: true, // Include child subcategories for recursion
      },
    });
  }

  update(id: string, dto: UpdateSubcategoryDto) {
    return this.prisma.subcategory.update({
      where: { id },
      data: dto,
    });
  }

  remove(id: string) {
    return this.prisma.subcategory.delete({
      where: { id },
    });
  }
}
