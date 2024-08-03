import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Category } from '../schemas/category.schema';
import { Expose } from 'class-transformer';

export class CreateOrUpdateCategoryDto implements Omit<Category, '_id'> {
  @Expose()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Expose()
  @IsOptional()
  @IsString()
  photoUrl: string;

  @Expose()
  @IsNumber()
  sortOrder: number;
}