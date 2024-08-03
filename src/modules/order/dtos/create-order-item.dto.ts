import { Expose, Type } from 'class-transformer';
import { IsNumber, IsString, ValidateNested } from 'class-validator';
import { CreateOrderItemSelectedOptionDto } from './create-order-item-selected-option.dto';

export class CreateOrderItemDto {
  @Expose()
  @IsString()
  productId: string;

  @Expose()
  @Type(() => CreateOrderItemSelectedOptionDto)
  @ValidateNested({ each: true })
  selectedOptions: CreateOrderItemSelectedOptionDto[];

  @Expose()
  @IsNumber()
  qty: number;
}