import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { OrderItem } from './order-item.schema';
import { PaymentType } from '../enums/payment-type.enum';


@Schema()
export class Order {
  @Prop()
  _id: number;

  @Prop({ required: true })
  createdAtIso: string;

  @Prop({ required: true, enum: PaymentType })
  paymentType: PaymentType;

  @Prop({ type: [OrderItem], default: [] })
  orderItems: OrderItem[];

  @Prop({ required: true })
  totalPrice: number;

  @Prop({ required: true })
  totalProfit: number;

  static collectionName = 'orders';
}

export const OrderSchema = SchemaFactory.createForClass(Order);
