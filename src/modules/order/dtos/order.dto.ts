import { Order } from '../schemas/order.schema';
import { CreateOrUpdateOrderDto } from './create-or-update-order.dto';
import { Expose } from 'class-transformer';
import { OrderItemDto } from './order-item.dto';
import { TransformGetId } from '../../../utils/transform-get-id.decorator';

export class OrderDto extends CreateOrUpdateOrderDto implements Omit<Order, '_id'> {
  @Expose()
  @TransformGetId()
  id: number;

  @Expose()
  totalPrice: number;

  @Expose()
  totalProfit: number;

  @Expose()
  override orderItems: OrderItemDto[];
}
