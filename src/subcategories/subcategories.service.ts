import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/auth/prisma/prisma.service';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';

@Injectable()
export class SubcategoriesService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateSubcategoryDto) {
<<<<<<< HEAD
    return this.prisma.subcategory.create({
      data: dto,
=======
    return this.prisma.subCategory.create({
      data: dto,
      include: {
        category: true,
        parent: true,
      },
>>>>>>> order
    });
  }

  findAll() {
<<<<<<< HEAD
    return this.prisma.subcategory.findMany({
      include: {
        children: true, // Include child subcategories for recursion
=======
    return this.prisma.subCategory.findMany({
      include: {
        children: true,
>>>>>>> order
      },
    });
  }

  findOne(id: string) {
<<<<<<< HEAD
    return this.prisma.subcategory.findUnique({
      where: { id },
      include: {
        children: true, // Include child subcategories for recursion
=======
    return this.prisma.subCategory.findUnique({
      where: { id },
      include: {
        children: true,
>>>>>>> order
      },
    });
  }

  update(id: string, dto: UpdateSubcategoryDto) {
<<<<<<< HEAD
    return this.prisma.subcategory.update({
=======
    return this.prisma.subCategory.update({
>>>>>>> order
      where: { id },
      data: dto,
    });
  }

  remove(id: string) {
<<<<<<< HEAD
    return this.prisma.subcategory.delete({
=======
    return this.prisma.subCategory.delete({
>>>>>>> order
      where: { id },
    });
  }
}
