import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SelectedIngredient } from './selected-ingredient.schema';
import { Option } from './option.schema';
import { OptionVariant } from './option-variant.schema';

@Schema()
export class Product {
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ default: null })
  categoryId: string;

  @Prop({ type: [SelectedIngredient], default: [] })
  ingredients: SelectedIngredient[];

  @Prop({ type: [Option], default: [] })
  options: Option[];

  @Prop({ type: [OptionVariant], default: [], minlength: 1 })
  variants: OptionVariant[];

  @Prop({ default: 0, min: 0 })
  purchasePrice: number;

  @Prop({ default: null })
  photoUrl: string | null;

  @Prop({ required: true })
  sortOrder: number;

  @Prop({ default: 0 })
  salesCount: number;


  static collectionName: string = 'products';
}

export const ProductSchema = SchemaFactory.createForClass(Product);
