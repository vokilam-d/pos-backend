import { SelectedOptionDto } from './selected-option.dto';
import { IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { SelectedIngredientDto } from './selected-ingredient.dto';
import { OptionVariant } from '../schemas/option-variant.schema';

export class OptionVariantDto implements OptionVariant {
  @Expose()
  @Type(() => SelectedOptionDto)
  @ValidateNested({ each: true })
  selectedOptions: SelectedOptionDto[];

  @Expose()
  @Type(() => SelectedIngredientDto)
  @ValidateNested({ each: true })
  ingredients: SelectedIngredientDto[];

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  primeCost: number;

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  markupPercent: number;

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  price: number;
}