import { ArrayMinSize, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Product } from '../schemas/product.schema';
import { Expose, Type } from 'class-transformer';
import { SelectedIngredientDto } from './selected-ingredient.dto';
import { OptionVariantDto } from './option-variant.dto';
import { OptionDto } from './option.dto';

export class CreateOrUpdateProductDto implements Omit<Product, '_id' | 'salesCount'> {
  @Expose()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Expose()
  @IsOptional()
  @IsString()
  categoryId: string;

  @Expose()
  @Type(() => SelectedIngredientDto)
  @ValidateNested({ each: true })
  ingredients: SelectedIngredientDto[];

  @Expose()
  @Type(() => OptionDto)
  @ValidateNested({ each: true })
  options: OptionDto[];

  @Expose()
  @Type(() => OptionVariantDto)
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  variants: OptionVariantDto[];

  @Expose()
  @IsNumber()
  purchasePrice: number;

  @Expose()
  @IsOptional()
  @IsString()
  photoUrl: string;

  @Expose()
  @IsNumber()
  sortOrder: number;
}