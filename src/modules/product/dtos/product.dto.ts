import { Product } from '../schemas/product.schema';
import { CreateOrUpdateProductDto } from './create-or-update-product.dto';
import { Exclude, Expose } from 'class-transformer';
import { TransformGetId } from '../../../utils/transform-get-id.decorator';

export class ProductDto extends CreateOrUpdateProductDto implements Product {
  @Exclude()
  _id: string;

  @Expose()
  @TransformGetId()
  id: string;

  @Expose()
  salesCount: number;
}