import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { SelectedIngredient } from '../schemas/selected-ingredient.schema';

export class SelectedIngredientDto implements SelectedIngredient {
  @Expose()
  @IsString()
  @IsNotEmpty()
  ingredientId: string;

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  qty: number;
}
