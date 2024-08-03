import { Ingredient } from '../schemas/ingredient.schema';
import { CreateOrUpdateIngredientDto } from './create-or-update-ingredient.dto';
import { Exclude, Expose } from 'class-transformer';
import { TransformGetId } from '../../../utils/transform-get-id.decorator';

export class IngredientDto extends CreateOrUpdateIngredientDto implements Ingredient {
  @Exclude()
  _id: string;

  @Expose()
  @TransformGetId()
  id: string;
}