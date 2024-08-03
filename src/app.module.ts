import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from './config';
import { CategoryModule } from './modules/category/category.module';
import { IngredientModule } from './modules/ingredient/ingredient.module';
import { ProductModule } from './modules/product/product.module';
import { HealthModule } from './modules/health/health.module';
import { OrderModule } from './modules/order/order.module';
import { GlobalModule } from './modules/global/global.module';

@Module({
  imports: [
    MongooseModule.forRoot(config.mongoUri, { retryDelay: 1 }),
    CategoryModule,
    IngredientModule,
    ProductModule,
    HealthModule,
    OrderModule,
    GlobalModule,
  ],
})
export class AppModule {}
