import { OrderItem } from '../schemas/order-item.schema';
import { Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { OrderItemSelectedOptionDto } from './order-item-selected-option.dto';
import { OrderItemIngredientDto } from './order-item-ingredient.dto';
import { CreateOrderItemDto } from './create-order-item.dto';


export class OrderItemDto extends CreateOrderItemDto implements OrderItem {
  @Expose()
  name: string;

  @Expose()
  photoUrl: string;

  @Expose()
  @Type(() => OrderItemSelectedOptionDto)
  @ValidateNested({ each: true })
  override selectedOptions: OrderItemSelectedOptionDto[];

  @Expose()
  @Type(() => OrderItemIngredientDto)
  @ValidateNested({ each: true })
  ingredients: OrderItemIngredientDto[];

  @Expose()
  primeCost: number;

  @Expose()
  markupPercent: number;

  @Expose()
  price: number;

  @Expose()
  profit: number;

  @Expose()
  totalPrice: number;

  @Expose()
  totalProfit: number;
}
