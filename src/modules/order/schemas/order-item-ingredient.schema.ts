import { Prop, Schema } from '@nestjs/mongoose';
import { Unit } from '../../ingredient/enums/unit.enum';

@Schema()
export class OrderItemIngredient {
  @Prop({ required: true })
  ingredientId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  unit: Unit;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  qty: number;

  /**
   * price * qty
   */
  @Prop({ required: true })
  cost: number;
}