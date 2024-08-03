import { Module } from '@nestjs/common';
import { IngredientService } from './services/ingredient.service';
import { IngredientController } from './controllers/ingredient.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Ingredient, IngredientSchema } from './schemas/ingredient.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Ingredient.name, schema: IngredientSchema, collection: 'ingredients' },
    ]),
  ],
  providers: [IngredientService],
  controllers: [IngredientController],
  exports: [IngredientService],
})
export class IngredientModule {}
