import { OptionValueDto } from './option-value.dto';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { Option } from '../schemas/option.schema';

export class OptionDto implements Option {
  @Expose()
  @IsString()
  @IsNotEmpty()
  id: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Expose()
  @Type(() => OptionValueDto)
  @ValidateNested({ each: true })
  values: OptionValueDto[];
}
