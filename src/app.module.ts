import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { SubCategoriesModule } from './subcategories/subcategories.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Ensures ConfigModule is available across all modules
    }),
    AuthModule,
    CategoriesModule,
    SubCategoriesModule,
    UsersModule,
    ProductsModule,
    CategoriesModule,
    SubCategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
