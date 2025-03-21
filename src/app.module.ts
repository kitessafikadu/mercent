import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { SubCategoriesModule } from './subcategories/subcategories.module';
import { SubSubCategoriesModule } from './subsubcategories/subsubcategories.module';

@Module({
  imports: [
    AuthModule,
    CategoriesModule,
    SubCategoriesModule,
    UsersModule,
    ProductsModule,
    CategoriesModule,
    SubCategoriesModule,
    SubSubCategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
