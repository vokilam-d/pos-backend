import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { OptionValue } from '../schemas/option-value.schema';

export class OptionValueDto implements OptionValue {
  @Expose()
  @IsString()
  @IsNotEmpty()
  id: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  name: string;
}
