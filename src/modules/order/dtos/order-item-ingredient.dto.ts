import { Unit } from '../../ingredient/enums/unit.enum';
import { Expose } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import { OrderItemIngredient } from '../schemas/order-item-ingredient.schema';

export class OrderItemIngredientDto implements OrderItemIngredient {
  @Expose()
  @IsString()
  ingredientId: string;

  @Expose()
  name: string;

  @Expose()
  unit: Unit;

  @Expose()
  price: number;

  @Expose()
  @IsNumber()
  qty: number;

  @Expose()
  cost: number;
}