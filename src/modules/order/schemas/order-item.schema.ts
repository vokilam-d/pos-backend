import { Prop, Schema } from '@nestjs/mongoose';
import { OrderItemSelectedOption } from './order-item-selected-option.schema';
import { OrderItemIngredient } from './order-item-ingredient.schema';

@Schema()
export class OrderItem {
  @Prop({ required: true })
  productId: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  photoUrl: string;

  @Prop({ type: [OrderItemSelectedOption], default: [] })
  selectedOptions: OrderItemSelectedOption[];

  @Prop({ type: [OrderItemIngredient], default: [] })
  ingredients: OrderItemIngredient[];

  /**
   * Sum of costs of all ingredients
   */
  @Prop({ required: true })
  primeCost: number;

  /**
   * Percent of markup of product
   */
  @Prop({ required: true })
  markupPercent: number;

  /**
   * formula: "primeCost * (markupPercent / 100)"
   */
  @Prop({ required: true })
  price: number;

  /**
   * formula: "price - primeCost"
   */
  @Prop({ required: true })
  profit: number;

  /**
   * quantity of bought products
   */
  @Prop({ required: true })
  qty: number;

  /**
   * formula: "price * qty"
   */
  @Prop({ required: true })
  totalPrice: number;

  /**
   * formula: "profit * qty"
   */
  @Prop({ required: true })
  totalProfit: number;
}
