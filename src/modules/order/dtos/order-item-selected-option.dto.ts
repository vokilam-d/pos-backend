import { OrderItemSelectedOption } from '../schemas/order-item-selected-option.schema';
import { Expose } from 'class-transformer';
import { CreateOrderItemSelectedOptionDto } from './create-order-item-selected-option.dto';


export class OrderItemSelectedOptionDto extends CreateOrderItemSelectedOptionDto implements OrderItemSelectedOption {
  @Expose()
  optionName: string;

  @Expose()
  optionValueName: string;
}
