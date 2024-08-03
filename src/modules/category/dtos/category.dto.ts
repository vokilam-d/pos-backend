import { Category } from '../schemas/category.schema';
import { CreateOrUpdateCategoryDto } from './create-or-update-category.dto';
import { Exclude, Expose } from 'class-transformer';
import { TransformGetId } from '../../../utils/transform-get-id.decorator';

export class CategoryDto extends CreateOrUpdateCategoryDto implements Category {
  @Exclude()
  _id: string;

  @Expose()
  @TransformGetId()
  id: string;
}