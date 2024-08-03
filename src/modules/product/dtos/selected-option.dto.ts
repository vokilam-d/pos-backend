import { IsNotEmpty, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { SelectedOption } from '../schemas/selected-option.schema';

export class SelectedOptionDto implements SelectedOption {
  @Expose()
  @IsString()
  @IsNotEmpty()
  optionId: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  optionValueId: string;
}