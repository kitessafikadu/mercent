import { Module } from '@nestjs/common';
import { AttributesController } from './attributes.controller';
import { AttributesService } from './attributes.service';
import { PrismaService } from 'src/auth/prisma/prisma.service';

@Module({
  controllers: [AttributesController],
  providers: [AttributesService, PrismaService],
  exports: [AttributesService],
})
export class AttributesModule {}
