import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class CreateOrderItemSelectedOptionDto {
  @Expose()
  @IsString()
  optionId: string;

  @Expose()
  @IsString()
  optionValueId: string;
}